import { type FigmaAgnosticDescriptor } from './types'
import { type GeneratorOptions, createXStateV4Machine } from './generators'
import { copyToClipboard } from 'figx'
import { traversePage } from './traverse'
import { generateNewWriter } from './utils'
import { showUI } from '@create-figma-plugin/utilities'

export default function main() {
  const figmaAgnosticDescriptor: FigmaAgnosticDescriptor = {
    pageName: figma.currentPage.name,
    simplifiedFrames: [],
    interactiveNodes: [],
  }

  // --------------------------------------------------
  // TRAVERSE
  traversePage({ figmaAgnosticDescriptor })
  // --------------------------------------------------

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

  const content = writer.toString()
  const options = { width: 480, height: 240 }
  showUI(options, { content })

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // Keeping it running allow later collapsed console.log inspection
  // figma.closePlugin()
  // figma.closePlugin('Hello, world!')
}
