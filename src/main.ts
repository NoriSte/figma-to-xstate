import { showUI } from '@create-figma-plugin/utilities'
import type { FigmaAgnosticDescriptor } from './types'
import { type GeneratorOptions, generateXStateV4Machine } from './generators'
import { traversePage } from './traverse'
import { generateNewWriter } from './utils'

export default function main() {
  // --------------------------------------------------
  // TRAVERSE
  const { simplifiedFrames } = traversePage()

  // --------------------------------------------------

  const figmaAgnosticDescriptor: FigmaAgnosticDescriptor = {
    pageName: figma.currentPage.name,
    simplifiedFrames,

  }

  const writer = generateNewWriter()

  const generatorOptions: GeneratorOptions = {
    writer,
    figmaAgnosticDescriptor,
  }

  console.log('generatorOptions', JSON.stringify(figmaAgnosticDescriptor), null, 2)

  // return

  // --------------------------------------------------
  // GENERATE
  generateXStateV4Machine(generatorOptions)
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
