// --------------------------------------------------
// VARS

import CodeBlockWriter from 'code-block-writer'
import { type SimplifiedFrame, type InteractiveNode } from './types'
import { createXStateV4Machine } from './generators'
import { traversePage } from './traverse'

// --------------------------------------------------

// -----------------------

export default function () {
  const mutableSimplifiedFrames: SimplifiedFrame[] = []
  const mutableInteractiveNodes: InteractiveNode[] = []

  traversePage({ mutableSimplifiedFrames, mutableInteractiveNodes })

  const writer = new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2,
  })

  createXStateV4Machine({
    writer,
    currentPageName: figma.currentPage.name,
    simplifiedFrames: mutableSimplifiedFrames,
    interactiveNodes: mutableInteractiveNodes,
  })
  console.log(writer.toString())

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  figma.closePlugin('Hello, world!')
}
