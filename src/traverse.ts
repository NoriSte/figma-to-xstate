import { isFrame, type SimplifiedFrame, type NavigateOnInteractionNode } from './types'
import {
  matchElementThatNavigateOnDrag,
  matchElementThatNavigateOnClick,
  matchElementThatNavigateOnMouseEvent,
} from './utils'

type Params = {
  mutableFrames: SimplifiedFrame[]
  mutableNavigateOnInteractionNodes: NavigateOnInteractionNode[]
}

// --------------------------------------------------

// --------------------------------------------------
// FIGMA RELATED
// --------------------------------------------------
export function traversePage(params: Params) {
  const { mutableFrames, mutableNavigateOnInteractionNodes: mutableElementsThatNavigate } = params

  const skipInvisibleInstanceChildrenBackup = figma.skipInvisibleInstanceChildren

  // Skip over invisible nodes and their descendants inside instances
  // for faster performance.
  figma.skipInvisibleInstanceChildren = true

  let lastFrame: FrameNode
  figma.currentPage.findAll((node) => {
    // Loop optimized to traverse the full document only once

    if (isFrame(node)) {
      mutableFrames.push({
        id: node.id,
        name: node.name,
      })
      lastFrame = node
    }

    matchElementThatNavigateOnDrag(mutableElementsThatNavigate, node, lastFrame)
    matchElementThatNavigateOnClick(mutableElementsThatNavigate, node, lastFrame)
    matchElementThatNavigateOnMouseEvent(mutableElementsThatNavigate, node, lastFrame)

    return false
  })

  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup
}
