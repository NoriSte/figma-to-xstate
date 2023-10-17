// --------------------------------------------------
// VARS

import { type SimplifiedFrame, type InteractiveNode } from './types'
import { type GeneratorOptions, createXStateV4Machine } from './generators'
import { traversePage } from './traverse'
import { generateNewWriter } from './utils'

// --------------------------------------------------

// -----------------------

export default function () {
  const mutableSimplifiedFrames: SimplifiedFrame[] = []
  const mutableInteractiveNodes: InteractiveNode[] = []

  traversePage({ mutableSimplifiedFrames, mutableInteractiveNodes })

  const writer = generateNewWriter()

  const generatorOptions: GeneratorOptions = {
    writer,
    currentPageName: figma.currentPage.name,
    simplifiedFrames: mutableSimplifiedFrames,
    interactiveNodes: mutableInteractiveNodes,
  }

  console.log(
    'generatorOptions',
    JSON.stringify({
      currentPageName: generatorOptions.currentPageName,
      simplifiedFrames: generatorOptions.simplifiedFrames,
      interactiveNodes: generatorOptions.interactiveNodes,
    }),
    null,
    2
  )

  createXStateV4Machine(generatorOptions)
  console.log(writer.toString())

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  figma.closePlugin('Hello, world!')
}
