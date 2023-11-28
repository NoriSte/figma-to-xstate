import type CodeBlockWriter from 'code-block-writer'

import { normalizeString } from './utils'
import type { FigmaAgnosticDescriptor, SimplifiedFrame } from './types'

export interface GeneratorOptions {
  readonly writer: CodeBlockWriter
  readonly figmaAgnosticDescriptor: FigmaAgnosticDescriptor
}

function createWriterUtils(writer: CodeBlockWriter) {
  return {
    stateId(id: string) { writer.write('id:').quote().write(id).quote().write(',').newLine() },
    initialState(name: string) { writer.write('initial:').quote().write(normalizeString(name)).quote().write(',').newLine() },
    stateBlock(stateName: string, callback: () => void) { writer.write(stateName).write(':').inlineBlock(callback).write(',').newLine() },
    states(callback: () => void) { writer.write('states:').inlineBlock(callback).write(',').newLine() },
    on(callback: () => void) { writer.write('on:').inlineBlock(callback).write(',').newLine() },
    stateMachineConfig(callback: () => void) { writer.block(callback).write(',') },
    writeFinal() { writer.write('type:').quote().write('final').quote().write(',') },
    idleState() { writer.write('idle:').write('{},').newLine() },
    eventGoTo(eventName: string, destinationState: string) { writer.write(eventName).write(':').quote().write(destinationState).quote().write(',').newLine() },
    eventAfter(destinationState: string, delay: number) {
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
      generateStates({
        writer,

        simplifiedFrames: simplifiedFramesTree,
        statesPath: machineId,
        writeUtils: w,

      })
    })
  })

  return writer
}

interface StatesGeneratorOptions {
  readonly writer: CodeBlockWriter
  readonly simplifiedFrames: SimplifiedFrame[]
  readonly statesPath: string
  readonly writeUtils: ReturnType<typeof createWriterUtils>
}

export function generateStates(params: StatesGeneratorOptions) {
  const {
    writer,
    statesPath,
    simplifiedFrames,

    writeUtils: w,
  } = params

  for (const simplifiedFrame of simplifiedFrames) {
    // TODO: Support fragments with same name
    // ex. Frame_1
    const frameStateId = normalizeString(simplifiedFrame.name)

    // ex. Frame_1
    w.stateBlock(frameStateId, () => {
      // State body
      const containStateEvents = simplifiedFrame.reactionsData.length

      if (!containStateEvents) {
        // --> type: 'final'
        w.writeFinal()
        return
      }

      const containDelayedReactions = containStateEvents && simplifiedFrame.reactionsData.some(reactionData => 'delay' in reactionData)
      const containOnScrollReactions = containStateEvents && simplifiedFrame.reactionsData.some(reactionData => reactionData.navigationType === 'SCROLL_TO')
      const requireSubStates = containDelayedReactions || containOnScrollReactions

      const needUniqueId = requireSubStates

      if (needUniqueId)
        // TODO: make sure the id is unique
        w.stateId(frameStateId)

      //   // --> initial: 'idle',
      if (requireSubStates) {
        w.initialState('idle')
        w.states(() => {
          // Idle state
          // --> idle:{},
          w.idleState()

          // Delayed navigation states
          for (const reactionData of simplifiedFrame.reactionsData) {
            if (!('delay' in reactionData))
              continue
            if (typeof reactionData.delay === 'undefined')
              continue

            if (reactionData.navigationType === 'NAVIGATE') {
            // ex. MOUSE_UP_NAVIGATE_TO_FRAME_2_WITH_DELAY
              const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}`)

              const delay = reactionData.delay
              // ex. #Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000
              const stateName = `${eventName}_AFTER_${delay}`

              // ex. #Page_1.Frame_2
              const destinationPath = `#${statesPath}.${normalizeString(reactionData.destinationFrameName)}`

              w.stateBlock(stateName, () => {
                w.eventAfter(destinationPath, delay)
              })
            }
          }

          // Scrollable states
          for (const reactionData of simplifiedFrame.reactionsData) {
            if (reactionData.navigationType !== 'SCROLL_TO')
              continue

            w.stateBlock(normalizeString(reactionData.destinationNodeName), () => {})
          }
        })
      }

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

        // Scrollable states
        for (const reactionData of simplifiedFrame.reactionsData) {
          if (reactionData.navigationType !== 'SCROLL_TO')
            continue

          // ex. ???????
          const eventName = normalizeString(`${reactionData.triggerType}_${reactionData.generatedName.toUpperCase()}_${reactionData.navigationType}`)

          // TODO: convert statesPath back to pageId
          // TODO: support destinations with same name
          const statePath = `#${statesPath}.${frameStateId}.${normalizeString(reactionData.destinationNodeName)}`

          w.eventGoTo(eventName, statePath)
        }
      })
    })
  }

  return writer
}

export function generateXStateV4Machine(params: GeneratorOptions) {
  generateXStateV4StateMachineOptions(params)
}
