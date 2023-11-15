import { isFrame } from './types'
import type { SimplifiedFrame, SimplifiedFrameTree } from './types'
import {
  findParentFrame,
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
      const simplifiedFrame: SimplifiedFrame = { id: node.id, name: node.name, reactionsData: [], framesChildren: [] }
      simplifiedFramesById[node.id] = simplifiedFrame

      const parentFrameId = findParentFrame(node.parent)?.id
      if (typeof parentFrameId === 'string') {
        const parentFrame = simplifiedFramesById[parentFrameId]
        if (!parentFrame)
          throw new Error(`The parent frame ${parentFrameId} does not exist`)

        parentFrame.framesChildren.push(simplifiedFrame)
      }
      else {
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
      if (typeof parentFrameId === 'string') {
        const parentFrame = simplifiedFramesById[parentFrameId]
        if (!parentFrame)
          throw new Error(`The parent frame ${parentFrameId} does not exist`)

        parentFrame.reactionsData.push(
          ...onDragReactionData,
          ...onClickReactionData,
          ...onMouseEventReactionData,
        )
      }
    }

    // Ensure the loop traverses the full document
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup

  return { simplifiedFramesTree }
}
