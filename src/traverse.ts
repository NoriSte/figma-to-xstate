import { isFrame } from './types'
import type { SimplifiedFrame, SimplifiedFrameTree } from './types'
import {
  assertIsDefined,
  findParentRootFrame,
  getOnClickReactionData,
  getOnDragReactionData,
  getOnMouseEventReactionData,
  isRootFrame,
} from './utils'

export function traversePage() {
  const simplifiedFramesTree: SimplifiedFrameTree = []
  const simplifiedFramesById: Record<string, SimplifiedFrame> = {}

  const { skipInvisibleInstanceChildren: skipInvisibleInstanceChildrenBackup } = figma

  // Skip over invisible nodes and their descendants inside instances for faster performance.
  figma.skipInvisibleInstanceChildren = true

  // Loop optimized to traverse the full document only once
  figma.currentPage.findAll((node) => {
    if (isFrame(node) && isRootFrame(node)) {
      simplifiedFramesById[node.id] ??= { type: 'FRAME', id: node.id, name: node.name, reactionsData: [] }
      const simplifiedFrame = simplifiedFramesById[node.id]
      assertIsDefined(simplifiedFrame, `Unexisting frame (node id ${node.id})`)

      simplifiedFramesTree.push(simplifiedFrame)
    }

    const onDragReactionData = getOnDragReactionData({ node })
    const onClickReactionData = getOnClickReactionData({ node })
    const onMouseEventReactionData = getOnMouseEventReactionData({ node })

    if (
      onDragReactionData.length
  || onClickReactionData.length
  || onMouseEventReactionData.length

    ) {
      const rootFrameId = findParentRootFrame(node).id

      const rootFrame = simplifiedFramesById[rootFrameId]
      assertIsDefined(rootFrame, `Root Frame not found (node id ${rootFrameId})`)

      const reactionsData = [
        ...onDragReactionData,
        ...onClickReactionData,
        ...onMouseEventReactionData,
      ]

      rootFrame.reactionsData.push(...reactionsData)
    }

    // Ensure the loop traverses the full document
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup

  return { simplifiedFramesTree }
}
