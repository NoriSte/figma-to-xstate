// --------------------------------------------------
// VARS

import { type NavigateOnClickNode } from './types'
import { createXStateV4VizCode } from './generators'
import { traversePage } from './traverse'

// --------------------------------------------------

// -----------------------

export default function () {
  const frames: FrameNode[] = []
  const elementsThatNavigate: NavigateOnClickNode[] = []

  traversePage({
    mutableFrames: frames,
    mutableElementsThatNavigate: elementsThatNavigate,
  })

  console.log({ frames, elementsThatNavigate })
  const code = createXStateV4VizCode({
    frames,
    elementsThatNavigate,
  })
  console.log(code)

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  figma.closePlugin('Hello, mondo!')
}
