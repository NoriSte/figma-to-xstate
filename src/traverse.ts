import { isFrame, type SimplifiedFrame, type InteractiveNode } from './types'
import {
  matchElementThatNavigateOnDrag,
  matchElementThatNavigateOnClick,
  matchElementThatNavigateOnMouseEvent,
} from './utils'

type Params = {
  mutableSimplifiedFrames: SimplifiedFrame[]
  mutableInteractiveNodes: InteractiveNode[]
}

// --------------------------------------------------

// --------------------------------------------------
// FIGMA RELATED
// --------------------------------------------------
export function traversePage(params: Params) {
  const { mutableSimplifiedFrames, mutableInteractiveNodes } = params

  const { skipInvisibleInstanceChildren } = figma

  // Skip over invisible nodes and their descendants inside instances for faster performance.
  figma.skipInvisibleInstanceChildren = true

  let parentFrame: FrameNode
  figma.currentPage.findAll((node) => {
    // Loop optimized to traverse the full document only once

    if (isFrame(node)) {
      mutableSimplifiedFrames.push({ id: node.id, name: node.name })

      // The loop traverses all the document, so we need to keep track of the last frame we
      // encounter to record the parent frame of the interactive nodes
      parentFrame = node
    }

    // TODO: optimize the following functions to not loop over reactions independently
    matchElementThatNavigateOnDrag({ mutableInteractiveNodes, node, parentFrame })
    matchElementThatNavigateOnClick({ mutableInteractiveNodes, node, parentFrame })
    matchElementThatNavigateOnMouseEvent({ mutableInteractiveNodes, node, parentFrame })

    // Ensure the loop does nto
    return false
  })

  // Restore the original value
  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildren
}
