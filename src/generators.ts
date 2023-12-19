import type CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import type { FigmaAgnosticDescriptor } from './types'

export interface GeneratorOptions {
  readonly writer: CodeBlockWriter
  readonly figmaAgnosticDescriptor: FigmaAgnosticDescriptor
}

function createWriterUtils(writer: CodeBlockWriter) {
  return {
    /**
     * Generic wrapper for the top-level object of the state machine.
     */
    stateMachineConfig(callback: () => void) { writer.block(callback) },

    /**
     * Add an empty idle state that can ba used as the default state of a state node. The parent state node is responsible to define the events to exit the idle state, if any.
     */
    idleState() { writer.write('idle:').write('{},').newLine() },

    /**
     * Mark a state as final. The state machine will stop when it reaches a final state.
     * @see https://xstate.js.org/docs/guides/final.html#final-states
     */
    finalType() { writer.write('type:').quote().write('final').quote().write(',') },

    /**
     * Add an id to a state node to be easily referenced across the state machine.
     * @see https://xstate.js.org/docs/guides/ids.html#custom-ids
     */
    stateId(id: string) { writer.write('id:').quote().write(id).quote().write(',').newLine() },

    /**
     * Set the initial state of a state node.
     * @see https://xstate.js.org/docs/guides/hierarchical.html#initial-states
     */
    initialState(name: string) { writer.write('initial:').quote().write(normalizeString(name)).quote().write(',').newLine() },

    /**
     * Create a block that contains all the states.
     * @see https://xstate.js.org/docs/guides/states.html#states
     */
    statesBlock(callback: () => void) { writer.write('states:').inlineBlock(callback).write(',').newLine() },

    /**
     * Create a new state node block.
     */
    stateBlock(stateName: string, callback: () => void) { writer.write(stateName).write(':').inlineBlock(callback).write(',').newLine() },

    /**
     * Create a new events block to list all the events of a state node.
     */
    eventsBlock(callback: () => void) { writer.write('on:').inlineBlock(callback).write(',').newLine() },

    /**
     * Create a `event: destination` pair.
     */
    eventGoTo(eventName: string, destinationState: string) { writer.write(eventName).write(':').quote().write(destinationState).quote().write(',').newLine() },

    /**
     * Create a `after` block that hosts delayed events.
     * @see https://xstate.js.org/docs/guides/delays.html#delayed-events
     * @todo Support multiple delayed events
     */
    eventAfterDelay(destinationState: string, delay: number) {
      /*
          -->
          after: {
            2000: '#Page_1.Frame_2',
          }
          */
      writer.write('after:').inlineBlock(() => {
        // --> 2000
        writer.write(delay.toString()).write(':').quote()
        // --> '#Page_1.Frame_2',
        writer.write(destinationState).quote().write(',').newLine()
      }).write(',')
    },
  }
}

export function generateXStateV4StateMachineOptions(params: GeneratorOptions) {
  const {
    writer,
    figmaAgnosticDescriptor: { simplifiedFrames, pageName },
  } = params

  const w = createWriterUtils(writer)

  const firstFrame = simplifiedFrames[0]
  if (!firstFrame)
    throw new Error('The document contains no frames.')

  const machineId = normalizeString(pageName)

  w.stateMachineConfig(() => {
    w.stateId(machineId)
    w.initialState(firstFrame.name)
    w.statesBlock(() => {
      for (const simplifiedFrame of simplifiedFrames) {
        // TODO: Support frames with same name
        const frameStateId = normalizeString(simplifiedFrame.name)

        // ex. Frame_1
        w.stateBlock(frameStateId, () => {
          // State body
          const containStateEvents = simplifiedFrame.reactionsData.length > 0
          if (!containStateEvents) {
            // --> type: 'final'
            w.finalType()
            return
          }

          const containDelayedReactions = simplifiedFrame.reactionsData.some(reactionData => 'delay' in reactionData)
          const containOnScrollReactions = simplifiedFrame.reactionsData.some(reactionData => reactionData.navigationType === 'SCROLL_TO')
          const requireSubStates = containDelayedReactions || containOnScrollReactions

          if (requireSubStates) {
            // TODO: make sure the id is unique
            w.stateId(frameStateId)

            w.initialState('idle')
            w.statesBlock(() => {
              // Idle state
              // --> idle:{},
              w.idleState()

              // Delayed navigation states
              for (const reactionData of simplifiedFrame.reactionsData) {
                const isDelayedReaction = ('delay' in reactionData) && reactionData.navigationType === 'NAVIGATE'
                if (!isDelayedReaction)
                  continue

                // Filter out reactions with delay = 0
                if (typeof reactionData.delay === 'undefined')
                  continue

                const {
                  delay,
                  triggerType,
                  generatedName,
                  destinationFrameName,
                } = reactionData

                // ex. MOUSE_UP_<FRAME_NAME>_AFTER_<DELAY>
                const stateName = `${normalizeString(`${triggerType}_${generatedName.toUpperCase()}`)}_AFTER_${delay}`
                // ex. #Page_1.<frame_name>
                const destinationPath = `#${machineId}.${normalizeString(destinationFrameName)}`

                w.stateBlock(stateName, () => w.eventAfterDelay(destinationPath, delay))
              }

              // Scrollable states
              for (const reactionData of simplifiedFrame.reactionsData) {
                if (reactionData.navigationType !== 'SCROLL_TO')
                  continue

                w.stateBlock(normalizeString(reactionData.destinationNodeName), () => {})
              }
            })
          }

          w.eventsBlock(() => {
            // State events (without delay)
            for (const reactionData of simplifiedFrame.reactionsData) {
              if (reactionData.navigationType !== 'NAVIGATE')
                continue
              if (('delay' in reactionData && typeof reactionData.delay !== 'undefined'))
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

            // Scrollable states
            for (const reactionData of simplifiedFrame.reactionsData) {
              if (reactionData.navigationType !== 'SCROLL_TO')
                continue

              // ex. ???????
              const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}_${reactionData.navigationType}`)

              // TODO: convert statesPath back to pageId
              // TODO: support destinations with same name
              const statePath = `#${machineId}.${frameStateId}.${normalizeString(reactionData.destinationNodeName)}`

              w.eventGoTo(eventName, statePath)
            }
          })
        })
      }
    })
  })

  return writer
}

export function generateXStateV4Machine(params: GeneratorOptions) {
  generateXStateV4StateMachineOptions(params)
}
