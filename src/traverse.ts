import { isFrame } from './types'
import type { InteractiveNode, SimplifiedFrameListItem } from './types'
import {
  findParentFrame,
  matchNodeThatNavigateOnClick,
  matchNodeThatNavigateOnDrag,
  matchNodeThatNavigateOnMouseEvent,
} from './utils'

export function traversePage() {
  const simplifiedFramesList: SimplifiedFrameListItem[] = []
  const interactiveNodes: InteractiveNode[] = []

  const { skipInvisibleInstanceChildren } = figma

  // Skip over invisible nodes and their descendants inside instances for faster performance.
  figma.skipInvisibleInstanceChildren = true

  let parentFrame: FrameNode
  figma.currentPage.findAll((node) => {
    // Loop optimized to traverse the full document only once

    if (isFrame(node)) {
      simplifiedFramesList.push({ id: node.id, name: node.name, parentFrameId: findParentFrame(node.parent)?.id })

      // The loop traverses all the document, going frame by frame inside all the frame's nodes.
      // We need to keep track of the last frame we encounter to record the parent frame of the
      // interactive nodes
      parentFrame = node
    }

    // TODO: optimize the following functions to not loop over reactions independently
    // TODO: make the following functions pure
    matchNodeThatNavigateOnDrag({ mutableInteractiveNodes: interactiveNodes, node, parentFrame })
    matchNodeThatNavigateOnClick({ mutableInteractiveNodes: interactiveNodes, node, parentFrame })
    matchNodeThatNavigateOnMouseEvent({ mutableInteractiveNodes: interactiveNodes, node, parentFrame })

    // Ensure the loop traverses the full document
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildren

  return {
    simplifiedFramesList,
    interactiveNodes,
  }
}
