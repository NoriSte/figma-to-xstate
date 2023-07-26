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
    // Machine id
    writer
      .write('id:')
      .space()
      .quote()
      .write(normalizeString(figma.currentPage.name))
      .quote()
      .write(',')
      .newLine()

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
            const navigateNodesInThisFrame = navigateOnInteractionNodes.filter(
              (element) => element.parentFrame.id === frame.id
            )

            const noMachineEvents = navigateNodesInThisFrame.length === 0
            if (noMachineEvents) {
              writer.writeLine(
                '// This frame does not contain anything that navigates to other frames'
              )
              return
            }

            // State events
            writer.write('on:').block(() => {
              for (const navigateNodeInThisFrame of navigateNodesInThisFrame) {
                const destinationFrame = frames.find(
                  ({ id }) => navigateNodeInThisFrame.destinationFrameId === id
                )

                if (!destinationFrame)
                  throw new Error(`Frame ${navigateNodeInThisFrame.destinationFrameId} not found`)

                const eventName = normalizeString(
                  `${
                    navigateNodeInThisFrame.triggerType
                  }_${navigateNodeInThisFrame.name.toUpperCase()}`
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
                  .newLine()
              }
            })
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
