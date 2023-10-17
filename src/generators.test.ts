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
      type: 'final'
    },
    Frame_2:{
      type: 'final'
    },
    Frame_3:{
      type: 'final'
    },
    Frame_4:{
      type: 'final'
    },
  }
}
    `.trim()
    )
  })

  it('When passed with the options generated from the "Simple frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
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
      interactiveNodes: [
        {
          node: { id: '1:8' },
          parentFrameId: '1:2',
          triggerType: 'ON_CLICK',
          destinationFrameId: '1:3',
          generatedName: 'Navigate to Frame 2',
        },
      ],
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toEqual(
      `
{
  id: 'Page_1',
  initial: 'Frame_1',
  states: {
    Frame_1:{
      on: {
        ON_CLICK_NAVIGATE_TO_FRAME_2: 'Frame_2',
      }
    },
    Frame_2:{
      type: 'final'
    },
    Frame_3:{
      type: 'final'
    },
    Frame_4:{
      type: 'final'
    },
  }
}
    `.trim()
    )
  })

  it('When passed with the options generated from the "Click and drag frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
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
      interactiveNodes: [
        {
          node: { id: '1:8' },
          parentFrameId: '1:2',
          triggerType: 'ON_CLICK',
          destinationFrameId: '1:3',
          generatedName: 'Click to navigate to Frame 2',
        },
        {
          node: { id: '1:12' },
          parentFrameId: '1:3',
          triggerType: 'ON_DRAG',
          destinationFrameId: '1:2',
          generatedName: 'Drag to navigate to Frame 1',
        },
      ],
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toEqual(
      `
{
  id: 'Page_1',
  initial: 'Frame_1',
  states: {
    Frame_1:{
      on: {
        ON_CLICK_CLICK_TO_NAVIGATE_TO_FRAME_2: 'Frame_2',
      }
    },
    Frame_2:{
      on: {
        ON_DRAG_DRAG_TO_NAVIGATE_TO_FRAME_1: 'Frame_1',
      }
    },
    Frame_3:{
      type: 'final'
    },
    Frame_4:{
      type: 'final'
    },
  }
}
    `.trim()
    )
  })
})
