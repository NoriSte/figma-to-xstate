import { describe, expect, it } from 'vitest'
import { type GeneratorOptions, createXStateV4StateMachineOptions } from './generators'
import { generateNewWriter } from './utils'

describe('createXStateV4StateMachineOptions', () => {
  it('When passed with an empty list of frames, then throws an error', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      currentPageName: 'unitTestPage',
      simplifiedFrames: [],
      interactiveNodes: [],
    }

    expect(() => createXStateV4StateMachineOptions(generatorOptions)).toThrowError(
      'The document contains no frames.'
    )
  })

  it('When passed with the options generated from the "Four empty frames" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()
    const generatorOptions: GeneratorOptions = {
      writer,
      currentPageName: 'Page 1',
      simplifiedFrames: [
        { id: '1:2', name: 'Frame 1' },
        { id: '1:3', name: 'Frame 2' },
        { id: '1:4', name: 'Frame 3' },
        { id: '1:5', name: 'Frame 4' },
      ],
      interactiveNodes: [],
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toEqual(
      `
{
  id: 'Page_1',
  initial: 'Frame_1',
  states: {
    Frame_1:{
      // This frame does not contain anything that navigates to other frames
    },
    Frame_2:{
      // This frame does not contain anything that navigates to other frames
    },
    Frame_3:{
      // This frame does not contain anything that navigates to other frames
    },
    Frame_4:{
      // This frame does not contain anything that navigates to other frames
    },
  }
}
    `.trim()
    )
  })
})
