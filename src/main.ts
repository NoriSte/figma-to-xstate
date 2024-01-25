import { on, showUI } from '@create-figma-plugin/utilities'
import type { FigmaAgnosticDescriptor } from './types'
import { type GeneratorOptions, generateXStateV4Machine } from './generators'
import { traversePage } from './traverse'
import { generateNewWriter } from './utils'

const uiOptions = { width: 480, height: 240 } as const

function run() {
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

  return writer.toString()
}

function runAndShowResult() {
  showUI(uiOptions, { generatedXStateConfig: run() })
}

export default function main() {
  runAndShowResult()

  // UI EVENTS
  on('REGENERATE', runAndShowResult)
}
