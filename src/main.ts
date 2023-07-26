// --------------------------------------------------
// VARS

import CodeBlockWriter from 'code-block-writer'
import { type SimplifiedFrame, type NavigateOnInteractionNode } from './types'
import { createXStateV4Machine } from './generators'
import { traversePage } from './traverse'

// --------------------------------------------------

// -----------------------

export default function () {
  const frames: SimplifiedFrame[] = []
  const navigateOnInteractionNodes: NavigateOnInteractionNode[] = []

  traversePage({
    mutableFrames: frames,
    mutableNavigateOnInteractionNodes: navigateOnInteractionNodes,
  })

  const writer = new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2,
  })

  console.log({ frames, navigateOnInteractionNodes })
  createXStateV4Machine({
    writer,
    frames,
    navigateOnInteractionNodes,
  })
  console.log(writer.toString())

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  figma.closePlugin('Hello, mondo!')
}
