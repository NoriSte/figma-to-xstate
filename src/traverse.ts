import { isFrame, type NavigateOnClickNode } from './types'
import { matchElementThatNavigateOnClick } from './utils'

type Params = {
  mutableFrames: FrameNode[]
  mutableElementsThatNavigate: NavigateOnClickNode[]
}

// --------------------------------------------------

// --------------------------------------------------
// FIGMA RELATED
// --------------------------------------------------
export function traversePage(params: Params) {
  const { mutableFrames, mutableElementsThatNavigate } = params

  const skipInvisibleInstanceChildrenBackup = figma.skipInvisibleInstanceChildren

  // Skip over invisible nodes and their descendants inside instances
  // for faster performance.
  figma.skipInvisibleInstanceChildren = true

  let lastFrame: FrameNode
  figma.currentPage.findAll((node) => {
    // Loop optimized to traverse the full document only once

    if (isFrame(node)) {
      mutableFrames.push(node)
      lastFrame = node
    }

    matchElementThatNavigateOnClick(mutableElementsThatNavigate, node, lastFrame)

    return false
  })

  figma.skipInvisibleInstanceChildren = skipInvisibleInstanceChildrenBackup
}
