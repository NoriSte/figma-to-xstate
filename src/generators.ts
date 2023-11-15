import type CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import type { FigmaAgnosticDescriptor, ReactionData } from './types'

export interface GeneratorOptions {
  readonly writer: CodeBlockWriter
  readonly figmaAgnosticDescriptor: FigmaAgnosticDescriptor
}

function createWriterUtils(writer: CodeBlockWriter) {
  return {
    stateId(id: string) { writer.newLine().write('id:').space().quote().write(id).quote().write(',') },
    initialState(name: string) { writer.newLine().write('initial:').space().quote().write(normalizeString(name)).quote().write(',') },
    stateBlock(stateName: string, callback: () => void) { writer.newLine().write(stateName).write(':').inlineBlock(callback).write(',') },
    states(callback: () => void) { writer.newLine().write('states:').block(callback).write(',') },
    on(callback: () => void) { writer.newLine().write('on:').block(callback).write(',') },
    stateMachineConfig(callback: () => void) { writer.block(callback).write(',') },
    typeFinal() { writer.writeLine('type: \'final\'').write(',') },
    idleState() { writer.write('idle:').inlineBlock().write(',').newLine().write(',') },
    eventGoTo(eventName: string, destinationState: string) { writer.newLine().write(eventName).write(':').space().quote().write(destinationState).quote().write(',') },
    eventAfter(eventName: string, destinationState: string, delay: number) {
      writer
        .newLine()
        .write(eventName)
        .write(':')
        .inlineBlock(() => {
        /*
        -->
        after: {
          2000: '#Page_1.Frame_2',
        }
        */
          writer.write('after:').block(() => {
          // --> 2000
            writer.write(delay.toString()).write(':').space().quote()
            // --> '#Page_1.Frame_2',
            writer.write(destinationState).quote().write(',').newLine()
          })
        })
        .write(',')
    },
  }
}

export function createXStateV4StateMachineOptions(params: GeneratorOptions) {
  const {
    writer,
    figmaAgnosticDescriptor: { simplifiedFramesTree, pageName },
  } = params

  const w = createWriterUtils(writer)

  const firstFrame = simplifiedFramesTree[0]
  if (!firstFrame)
    throw new Error('The document contains no frames.')

  const machineId = normalizeString(pageName)

  w.stateMachineConfig(() => {
    w.stateId(machineId)
    w.initialState(firstFrame.name)
    w.states(() => {
      for (const simplifiedFrame of simplifiedFramesTree) {
        // TODO: Support fragments with same name
        // ex. Frame_1
        const frameStateId = normalizeString(simplifiedFrame.name)

        // ex. Frame_1
        w.stateBlock(frameStateId, () => {
          // State body

          // TODO: make sure it's really unique
          const requireSubStates = simplifiedFrame.reactionsData.some(node => 'delay' in node)
          const needUniqueId = requireSubStates

          if (needUniqueId)
            w.stateId(frameStateId)

          const noStateEvents = simplifiedFrame.reactionsData.length === 0
          if (noStateEvents) {
            // --> type: 'final'
            w.typeFinal()
            return
          }

          //   // --> initial: 'idle',
          if (requireSubStates) {
            w.initialState('idle')

            // --> states: {
            w.states(() => {
            // Idle state
            // --> idle:{},
              w.idleState()

              // TEMP --------------------------------------

              for (const reactionData of simplifiedFrame.reactionsData) {
                if (!('delay' in reactionData))
                  continue
                if (typeof reactionData.delay === 'undefined')
                  continue

                if (reactionData.navigationType === 'NAVIGATE') {
                  // ex. MOUSE_UP_NAVIGATE_TO_FRAME_2_WITH_DELAY
                  const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}`)

                  // ex. #Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000
                  const stateName = `${eventName}_AFTER_${reactionData.delay}`

                  // ex. #Page_1.Frame_2
                  const destinationPath = `#${machineId}.${normalizeString(reactionData.destinationFrameName)}`

                  w.eventAfter(stateName, destinationPath, reactionData.delay)
                }
              }

              // TEMP --------------------------------------
            })
          }

          // TODO: narrow down to specific types
          const navigatingNodesThatRequireSubStates = simplifiedFrame.reactionsData.filter(
            node => doesNavigatingNodeRequireSubStates(node),
          )
          const navigatingNodesThatDoNotRequireSubStates = simplifiedFrame.reactionsData.filter(
            node => !doesNavigatingNodeRequireSubStates(node),
          )

          w.on(() => {
            // State events (without delay)
            for (const reactionData of simplifiedFrame.reactionsData) {
              if (!('destinationFrameId' in reactionData))
                continue
              if (('delay' in reactionData))
                continue

              // ex. ON_CLICK_NAVIGATE_TO_FRAME_3
              const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}`)

              w.eventGoTo(eventName, normalizeString(reactionData.destinationFrameName))
            }

            // State events (with delay)
            for (const reactionData of simplifiedFrame.reactionsData) {
              if (!('delay' in reactionData))
                continue

              // ex. MOUSE_UP_NAVIGATE_TO_FRAME_2
              const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}`)
              // ex. MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000
              const destinationStateName = `${eventName}_AFTER_${reactionData.delay}`

              // ex. #Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000
              const fullDestination = `#${frameStateId}.${destinationStateName}`

              // --> MOUSE_UP_NAVIGATE_TO_FRAME_2: '#Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000',
              w.eventGoTo(eventName, fullDestination)
            }
          })
        })
      }
    })
  })

  return writer
}

export function createXStateV4Machine(params: GeneratorOptions) {
  createXStateV4StateMachineOptions(params)
}

function doesNavigatingNodeRequireSubStates(node: ReactionData) {
  return 'delay' in node || node.navigationType === 'SCROLL_TO'
}
