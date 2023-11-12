import type CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import type { FigmaAgnosticDescriptor, InteractiveNode } from './types'

export interface GeneratorOptions {
  readonly writer: CodeBlockWriter
  readonly figmaAgnosticDescriptor: FigmaAgnosticDescriptor
}

export function createXStateV4StateMachineOptions(params: GeneratorOptions) {
  const {
    writer,
    figmaAgnosticDescriptor: { simplifiedFramesTree, interactiveNodes, pageName },
  } = params

  const firstFrame = simplifiedFramesTree[0]
  if (!firstFrame)
    throw new Error('The document contains no frames.')

  writer.block(() => {
    const machineId = normalizeString(pageName)

    // --> id: 'Page_1',
    writer.write('id:').space().quote().write(machineId).quote().write(',').newLine()

    // --> initial: 'Frame_1',
    writer
      .write('initial:').space().quote().write(normalizeString(firstFrame.name)).quote().write(',').newLine()

    // --> states: {
    writer.write('states:').block(() => {
      for (const simplifiedFrame of simplifiedFramesTree) {
        // TODO: Support fragments with same name
        // ex. Frame_1
        const frameStateId = normalizeString(simplifiedFrame.name)

        // State name
        // --> Frame_1: {
        writer.write(frameStateId).write(':').inlineBlock(() => {
          // State body

          /// --> id: 'Frame_1'
          writer.write('id:').space().quote().write(frameStateId).quote().write(',').newLine()

          const childNodesThatNavigate = interactiveNodes.filter(
            // TODO: support nested nodes
            element => element.parentFrameId === simplifiedFrame.id,
          )

          const noMachineEvents = childNodesThatNavigate.length === 0
          if (noMachineEvents) {
            // --> type: 'final'
            writer.writeLine('type: \'final\'')
            return
          }

          // TODO: narrow down to specific types
          const navigatingNodesThatRequireSubStates = childNodesThatNavigate.filter(
            node => doesNavigatingNodeRequireSubStates(node),
          )
          const navigatingNodesThatDoNotRequireSubStates = childNodesThatNavigate.filter(
            node => !doesNavigatingNodeRequireSubStates(node),
          )

          const delayedEvents = navigatingNodesThatRequireSubStates.map((childNodeThatNavigate) => {
            // ex. MOUSE_UP_NAVIGATE_TO_FRAME_2
            const eventName = normalizeString(`${childNodeThatNavigate.triggerType}_${childNodeThatNavigate.generatedName.toUpperCase()}`)

            const delay: number
                // @ts-expect-error TS does not kno the proper triggerType because types are not enough narrowed down in `childNodesThatNavigateWithDelay` definition
                = childNodeThatNavigate.delay

            const destinationFrame = simplifiedFramesTree.find(({ id }) => childNodeThatNavigate.destinationFrameId === id)

            if (!destinationFrame)
              throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`)

            // ex. #Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000
            const destinationStateName = `${eventName}_AFTER_${delay}`

            return { delay, eventName, destinationFrame, destinationStateName }
          })

          writer.write('on:').block(() => {
            // State events (without delay)
            for (const childNodeThatNavigate of navigatingNodesThatDoNotRequireSubStates) {
              const destinationFrame = simplifiedFramesTree.find(({ id }) => childNodeThatNavigate.destinationFrameId === id)

              if (!destinationFrame)
                throw new Error(`Frame ${childNodeThatNavigate.destinationFrameId} not found`)

              // ex. ON_CLICK_NAVIGATE_TO_FRAME_3
              const eventName = normalizeString(`${childNodeThatNavigate.triggerType}_${childNodeThatNavigate.generatedName.toUpperCase()}`)

              // --> ON_CLICK_NAVIGATE_TO_FRAME_3: 'Frame_3',
              writer.write(eventName).write(':').space().quote()
              writer.write(normalizeString(destinationFrame.name)).quote()
              writer.write(',').newLine() // TODO: should be avoided at the last event
            }

            // State events (with delay)
            for (const delayedEvent of delayedEvents) {
              const { eventName, destinationStateName } = delayedEvent

              // --> MOUSE_UP_NAVIGATE_TO_FRAME_2: '#Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000',
              writer.write(eventName).write(':').space().quote()
              writer.write(`#${frameStateId}.${destinationStateName}`).quote().write(',').newLine()
            }
          })

          if (
            navigatingNodesThatDoNotRequireSubStates.length
              && navigatingNodesThatRequireSubStates.length
          ) {
            // Separate the delay-free and delay-full groups
            writer.write(',').newLine()
          }

          // if (navigatingNodesThatRequireSubStates.length) {
          //   // --> id: 'Frame_1',
          //   writer.write('id:').space().quote().write(frameStateId).quote().write(',').newLine()

          //   // --> initial: 'idle',
          //   writer.write('initial:').space().quote().write('idle').quote().write(',').newLine()

          //   // --> states: {
          //   writer.write('states:').block(() => {
          //     // Idle state
          //     // --> idle:{},
          //     writer.write('idle:').inlineBlock(() => { /* The events have been managed above */ }).write(',').newLine()

          //     // Delayed events state
          //     for (const delayedEvent of delayedEvents) {
          //       const { destinationStateName, delay, destinationFrame } = delayedEvent

          //       // ex. #Page_1.Frame_2
          //       const destinationFrameName = `#${machineId}.${normalizeString(
          //           destinationFrame.name,
          //         )}`

          //       writer
          //         .write(destinationStateName)
          //         .write(':')
          //         .inlineBlock(() => {
          //           /*
          //           -->
          //           after: {
          //             2000: '#Page_1.Frame_2',
          //           }
          //           */
          //           writer.write('after:').block(() => {
          //             // --> 2000
          //             writer.write(delay.toString()).write(':').space().quote()
          //             // --> '#Page_1.Frame_2',
          //             writer.write(destinationFrameName).quote().write(',').newLine()
          //           })
          //         })
          //         .write(',')
          //         .newLine() // TODO: should be avoided at the last event
          //     }
          //   })
          // }
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

function doesNavigatingNodeRequireSubStates(node: InteractiveNode) {
  return 'delay' in node || node.navigationType === 'SCROLL_TO'
}
