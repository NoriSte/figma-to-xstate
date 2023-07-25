// --------------------------------------------------
// VARS

import CodeBlockWriter from 'code-block-writer'
import { type SimplifiedFrame, type NavigateOnClickNode } from './types'
import { createXStateV4Machine } from './generators'
import { traversePage } from './traverse'

// --------------------------------------------------

// -----------------------

export default function () {
  const frames: SimplifiedFrame[] = []
  const elementsThatNavigate: NavigateOnClickNode[] = []

  traversePage({
    mutableFrames: frames,
    mutableElementsThatNavigate: elementsThatNavigate,
  })

  const writer = new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2,
  })

  console.log({ frames, elementsThatNavigate })
  const code = createXStateV4Machine({
    writer,
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
