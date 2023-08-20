import CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import { type SimplifiedFrame, type NavigateOnInteractionNode } from './types'

type Params = {
  readonly frames: SimplifiedFrame[]
  readonly writer: CodeBlockWriter
  readonly navigateOnInteractionNodes: NavigateOnInteractionNode[]
}

export function createXStateV4StateMachineOptions(params: Params) {
  const { frames, navigateOnInteractionNodes, writer } = params

  const firstFrame = frames[0]
  if (!firstFrame) {
    throw new Error('The document contains no frames.')
  }

  writer.block(() => {
    const machineId = normalizeString(figma.currentPage.name)

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
      for (const frame of frames) {
        // State name
        writer
          .write(normalizeString(frame.name))
          .write(':')
          .inlineBlock(() => {
            // State body

            const childNodesThatNavigate = navigateOnInteractionNodes.filter(
              // TODO: support nested nodes
              (element) => element.parentFrame.id === frame.id
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

            if (childNodesThatNavigateWithoutDelay.length) {
              // State events (without delay)
              writer.write('on:').block(() => {
                for (const childNodeThatNavigate of childNodesThatNavigateWithoutDelay) {
                  const destinationFrame = frames.find(
                    ({ id }) => childNodeThatNavigate.destinationFrameId === id
                  )

                  if (!destinationFrame)
                    throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`)

                  const eventName = normalizeString(
                    `${
                      childNodeThatNavigate.triggerType
                    }_${childNodeThatNavigate.generatedName.toUpperCase()}`
                  )

                  writer
                    // Event name
                    .write(eventName)
                    .write(':')
                    .space()
                    .quote()
                    // Target state
                    .write(normalizeString(destinationFrame.name))
                    .quote()
                    .write(',')
                    .newLine() // TODO: should be avoided at the last event
                }
              })
            }

            if (
              childNodesThatNavigateWithoutDelay.length &&
              childNodesThatNavigateWithDelay.length
            ) {
              // Separate the two delay-free and delay-full groups
              writer.write(',').newLine()
            }
            console.log({ childNodesThatNavigateWithDelay, childNodesThatNavigateWithoutDelay })

            if (childNodesThatNavigateWithDelay.length) {
              // Figma allows to start other non-delayed events during the waiting for the timeout to tick.
              // In order to replicate this behavior, we need to generate some nested states like the following
              // State events (with delay)
              // example
              // states: {
              //   initial: 'idle',
              //   idle: {
              //     on: {
              //       MOUSE_UP_RECTANGLE_3: 'delay_300'
              //     }
              //   },
              //   delay_300: {
              //     after: {
              //       300: {target: '#Page.Home_page_fragment'}
              //     }
              //   }
              // }
              const delayedEvents = childNodesThatNavigateWithDelay.map((childNodeThatNavigate) => {
                const eventName = normalizeString(
                  `${
                    childNodeThatNavigate.triggerType
                  }_${childNodeThatNavigate.generatedName.toUpperCase()}`
                )

                const delay: number =
                  // @ts-expect-error TS does not kno the proper triggerType because types are not enough narrowed down in `childNodesThatNavigateWithDelay` definition
                  childNodeThatNavigate.delay

                const destinationFrame = frames.find(
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

              // Initial State
              writer.write('initial:').space().quote().write('idle').quote().write(',').newLine()

              writer.write('states:').block(() => {
                // Idle state
                writer
                  .write('idle:')
                  .inlineBlock(() => {
                    writer.write('on:').block(() => {
                      for (const delayedEvent of delayedEvents) {
                        const { eventName, destinationStateName } = delayedEvent

                        writer
                          // Event name
                          .write(eventName)
                          .write(':')
                          .space()
                          .quote()
                          // Target state
                          .write(destinationStateName)
                          .quote()
                          .write(',')
                          .newLine()
                      }
                    })
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
                        writer
                          // Event name
                          .write(delay.toString())
                          .write(':')
                          .space()
                          .quote()
                          // Target state
                          .write(destinationFrameName)
                          .quote()
                          .write(',')
                          .newLine()
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

export function createXStateV4Machine(params: Params) {
  createXStateV4StateMachineOptions(params)
}
