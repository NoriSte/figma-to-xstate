import CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import { type SimplifiedFrame, type InteractiveNode } from './types'

export type GeneratorOptions = {
  readonly currentPageName: string
  readonly writer: CodeBlockWriter
  readonly simplifiedFrames: SimplifiedFrame[]
  readonly interactiveNodes: InteractiveNode[]
}

export function createXStateV4StateMachineOptions(params: GeneratorOptions) {
  const { simplifiedFrames, interactiveNodes, writer, currentPageName } = params

  const firstFrame = simplifiedFrames[0]
  if (!firstFrame) {
    throw new Error('The document contains no frames.')
  }

  writer.block(() => {
    const machineId = normalizeString(currentPageName)

    // Machine id
    writer.write('id:').space().quote().write(machineId).quote().write(',').newLine()

    // Initial State
    writer
      .write('initial:')
      .space()
      .quote()
      .write(normalizeString(firstFrame.name))
      .quote()
      .write(',')
      .newLine()

    // Machine states
    writer.write('states:').block(() => {
      for (const simplifiedFrame of simplifiedFrames) {
        // TODO: Support fragments with same name
        const frameStateId = normalizeString(simplifiedFrame.name)

        // State name
        writer
          .write(frameStateId)
          .write(':')
          .inlineBlock(() => {
            // State body

            const childNodesThatNavigate = interactiveNodes.filter(
              // TODO: support nested nodes
              (element) => element.parentFrameId === simplifiedFrame.id
            )

            const noMachineEvents = childNodesThatNavigate.length === 0
            if (noMachineEvents) {
              writer.writeLine(
                '// This frame does not contain anything that navigates to other frames'
              )
              return
            }

            // TODO: narrow down to specific types
            const childNodesThatNavigateWithDelay = childNodesThatNavigate.filter(
              (node) => 'delay' in node
            )
            const childNodesThatNavigateWithoutDelay = childNodesThatNavigate.filter(
              (node) => !('delay' in node)
            )

            const delayedEvents = childNodesThatNavigateWithDelay.map((childNodeThatNavigate) => {
              const eventName = normalizeString(
                `${
                  childNodeThatNavigate.triggerType
                }_${childNodeThatNavigate.generatedName.toUpperCase()}`
              )

              const delay: number =
                // @ts-expect-error TS does not kno the proper triggerType because types are not enough narrowed down in `childNodesThatNavigateWithDelay` definition
                childNodeThatNavigate.delay

              const destinationFrame = simplifiedFrames.find(
                ({ id }) => childNodeThatNavigate.destinationFrameId === id
              )

              if (!destinationFrame)
                throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`)

              return {
                delay,
                eventName,
                destinationFrame,
                destinationStateName: `${eventName}_AFTER_${delay}`,
              }
            })

            writer.write('on:').block(() => {
              // State events (without delay)
              for (const childNodeThatNavigate of childNodesThatNavigateWithoutDelay) {
                const destinationFrame = simplifiedFrames.find(
                  ({ id }) => childNodeThatNavigate.destinationFrameId === id
                )

                if (!destinationFrame)
                  throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`)

                const eventName = normalizeString(
                  `${
                    childNodeThatNavigate.triggerType
                  }_${childNodeThatNavigate.generatedName.toUpperCase()}`
                )

                // Event name
                writer.write(eventName).write(':').space().quote()
                // Target state
                writer.write(normalizeString(destinationFrame.name)).quote()
                writer.write(',').newLine() // TODO: should be avoided at the last event
              }

              // State events (with delay)
              for (const delayedEvent of delayedEvents) {
                const { eventName, destinationStateName } = delayedEvent

                // Event name
                writer.write(eventName).write(':').space().quote()
                // Target state
                writer
                  .write(`#${frameStateId}.${destinationStateName}`)
                  .quote()
                  .write(',')
                  .newLine()
              }
            })

            if (
              childNodesThatNavigateWithoutDelay.length &&
              childNodesThatNavigateWithDelay.length
            ) {
              // Separate the two delay-free and delay-full groups
              writer.write(',').newLine()
            }

            if (childNodesThatNavigateWithDelay.length) {
              writer.write('id:').space().quote().write(frameStateId).quote().write(',').newLine()

              // Initial State
              writer.write('initial:').space().quote().write('idle').quote().write(',').newLine()

              writer.write('states:').block(() => {
                // Idle state
                writer
                  .write('idle:')
                  .inlineBlock(() => {
                    // The events have been managed above
                  })
                  .write(',')
                  .newLine()

                // Delayed events state
                for (const delayedEvent of delayedEvents) {
                  const { destinationStateName, delay, destinationFrame } = delayedEvent
                  const destinationFrameName = `#${machineId}.${normalizeString(
                    destinationFrame.name
                  )}`

                  writer
                    .write(destinationStateName)
                    .write(':')
                    .inlineBlock(() => {
                      writer.write('after:').block(() => {
                        // Event name
                        writer.write(delay.toString()).write(':').space().quote()
                        // Target state
                        writer.write(destinationFrameName).quote().write(',').newLine()
                      })
                    })
                    .write(',')
                    .newLine() // TODO: should be avoided at the last event
                }
              })
            }
          })
          .write(',')
          .newLine()
      }
    })
  })

  return writer
}

export function createXStateV4Machine(params: GeneratorOptions) {
  createXStateV4StateMachineOptions(params)
}
