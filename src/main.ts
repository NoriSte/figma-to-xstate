import { showUI } from '@create-figma-plugin/utilities'
import type { FigmaAgnosticDescriptor } from './types'
import { type GeneratorOptions, createXStateV4Machine } from './generators'
import { traversePage } from './traverse'
import { buildFrameTree, generateNewWriter } from './utils'

export default function main() {
  // --------------------------------------------------
  // TRAVERSE
  const { simplifiedFramesList, interactiveNodes } = traversePage()

  // --------------------------------------------------

  const figmaAgnosticDescriptor: FigmaAgnosticDescriptor = {
    pageName: figma.currentPage.name,
    simplifiedFramesTree: buildFrameTree(simplifiedFramesList),
    interactiveNodes,
  }

  const writer = generateNewWriter()

  const generatorOptions: GeneratorOptions = {
    writer,
    figmaAgnosticDescriptor,
  }

  console.log('generatorOptions', JSON.stringify(generatorOptions), null, 2)

  // --------------------------------------------------
  // GENERATE
  createXStateV4Machine(generatorOptions)
  // --------------------------------------------------

  const generatedXStateConfig = writer.toString()
  const options = { width: 480, height: 240 }
  showUI(options, { generatedXStateConfig })

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  // figma.closePlugin('Hello, world!')
}
