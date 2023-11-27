import { isFrame } from './types'
import type { SimplifiedFrame, SimplifiedFrameTree, SimplifiedNode } from './types'
import {
  findParentFrame,
  generateNodeName,
  getOnClickReactionData,
  getOnDragReactionData,
  getOnMouseEventReactionData,
} from './utils'

export function traversePage() {
  const simplifiedFramesTree: SimplifiedFrameTree = []
  const simplifiedFramesById: Record<string, SimplifiedFrame> = {}

  const { skipInvisibleInstanceChildren: skipInvisibleInstanceChildrenBackup } = figma

  // Skip over invisible nodes and their descendants inside instances for faster performance.
  figma.skipInvisibleInstanceChildren = true

  // Loop optimized to traverse the full document only once
  figma.currentPage.findAll((node) => {
    if (isFrame(node)) {
      simplifiedFramesById[node.id] ??= { type: 'FRAME', id: node.id, name: node.name, reactionsData: [], framesChildren: [] }
      const simplifiedFrame = simplifiedFramesById[node.id]
      assertIsDefined(simplifiedFrame)

      const parentFrameId = findParentFrame(node.parent)?.id
      if (typeof parentFrameId === 'string') {
        const parentFrame = simplifiedFramesById[parentFrameId]
        assertIsDefined(parentFrame)

        parentFrame.framesChildren.push(simplifiedFrame)
      }
      else {
        // Tree root
        simplifiedFramesTree.push(simplifiedFrame)
      }
    }

    const onDragReactionData = getOnDragReactionData({ node })
    const onClickReactionData = getOnClickReactionData({ node })
    const onMouseEventReactionData = getOnMouseEventReactionData({ node })

    if (
      onDragReactionData.length
  || onClickReactionData.length
  || onMouseEventReactionData.length

    ) {
      const parentFrameId = findParentFrame(node.parent)?.id

      assertIsString(parentFrameId)

      const parentFrame = simplifiedFramesById[parentFrameId]
      assertIsDefined(parentFrame)

      const reactionsData = [
        ...onDragReactionData,
        ...onClickReactionData,
        ...onMouseEventReactionData,
      ]

      // Add the SCROLL_TO targets as children
      for (const reactionData of reactionsData) {
        if (reactionData.navigationType === 'SCROLL_TO') {
          const node = figma.getNodeById(reactionData.destinationNodeId)
          assertIsDefined(node)

          if (!(node.type === 'FRAME')) {
            if (!simplifiedFramesById[node.id]) {
              const parentFrameId = findParentFrame(node.parent)?.id
              assertIsString(parentFrameId)

              const frameNode = figma.getNodeById(parentFrameId)
              assertIsDefined(frameNode)

              simplifiedFramesById[frameNode.id] ??= { type: 'FRAME', id: parentFrameId, name: frameNode.name, reactionsData: [], framesChildren: [] }
              const parentFrame = simplifiedFramesById[parentFrameId]
              assertIsDefined(parentFrame)

              const simplifiedChild: SimplifiedNode = { type: 'NODE', id: node.id, name: generateNodeName(node) }
              parentFrame.framesChildren.push(simplifiedChild)
            }
          }
        }

        parentFrame.reactionsData.push(reactionData)
      }
    }

    // Ensure the loop traverses the full document
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup

  return { simplifiedFramesTree }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null)
    throw new Error(`${value} is not defined`)
}
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string')
    throw new Error(`${value} is not a string`)
}
