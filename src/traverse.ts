import { isFrame, type FigmaAgnosticDescriptor } from './types'
import {
  matchElementThatNavigateOnDrag,
  matchElementThatNavigateOnClick,
  matchElementThatNavigateOnMouseEvent,
} from './utils'

export function traversePage(params: { figmaAgnosticDescriptor: FigmaAgnosticDescriptor }) {
  const {
    figmaAgnosticDescriptor: {
      simplifiedFrames: mutableSimplifiedFrames,
      interactiveNodes: mutableInteractiveNodes,
    },
  } = params

  const { skipInvisibleInstanceChildren } = figma

  // Skip over invisible nodes and their descendants inside instances for faster performance.
  figma.skipInvisibleInstanceChildren = true

  let parentFrame: FrameNode
  figma.currentPage.findAll((node) => {
    // Loop optimized to traverse the full document only once

    if (isFrame(node)) {
      mutableSimplifiedFrames.push({ id: node.id, name: node.name })

      // The loop traverses all the document, going frame by frame inside all the frame's nodes.
      // We need to keep track of the last frame we encounter to record the parent frame of the
      // interactive nodes
      parentFrame = node
    }

    // TODO: optimize the following functions to not loop over reactions independently
    // TODO: make the following functions pure
    matchElementThatNavigateOnDrag({ mutableInteractiveNodes, node, parentFrame })
    matchElementThatNavigateOnClick({ mutableInteractiveNodes, node, parentFrame })
    matchElementThatNavigateOnMouseEvent({ mutableInteractiveNodes, node, parentFrame })

    // Ensure the loop traverses the full document
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildren
}
