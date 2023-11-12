import { describe, expect, it } from 'vitest'
import { type GeneratorOptions, createXStateV4StateMachineOptions } from './generators'
import { generateNewWriter } from './utils'

describe('createXStateV4StateMachineOptions', () => {
  it('when passed with an empty list of frames, then throws an error', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'unitTestPage',
        simplifiedFramesTree: [],
        interactiveNodes: [],
      },
    }

    expect(() => createXStateV4StateMachineOptions(generatorOptions)).toThrowError(
      'The document contains no frames.',
    )
  })

  it('when passed with the options generated from the "Four empty frames" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          { id: '1:2', name: 'Frame 1', framesChildren: [] },
          { id: '1:3', name: 'Frame 2', framesChildren: [] },
          { id: '1:4', name: 'Frame 3', framesChildren: [] },
          { id: '1:5', name: 'Frame 4', framesChildren: [] },
        ],
        interactiveNodes: [],
      },
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(`
      "{
        id: 'Page_1',
        initial: 'Frame_1',
        states: {
          Frame_1:{
            id: 'Frame_1',
            type: 'final'
          },
          Frame_2:{
            id: 'Frame_2',
            type: 'final'
          },
          Frame_3:{
            id: 'Frame_3',
            type: 'final'
          },
          Frame_4:{
            id: 'Frame_4',
            type: 'final'
          },
        }
      }"
    `)
  })

  it('when passed with the options generated from the "Simple frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          { id: '1:2', name: 'Frame 1', framesChildren: [] },
          { id: '1:3', name: 'Frame 2', framesChildren: [] },
          { id: '1:4', name: 'Frame 3', framesChildren: [] },
          { id: '1:5', name: 'Frame 4', framesChildren: [] },
        ],
        interactiveNodes: [
          {
            node: { id: '1:8' },
            parentFrameId: '1:2',
            triggerType: 'ON_CLICK',
            destinationFrameId: '1:3',
            navigationType: 'NAVIGATE',
            generatedName: 'Navigate to Frame 2',
          },
        ],
      },
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id: 'Page_1',
        initial: 'Frame_1',
        states: {
          Frame_1:{
            id: 'Frame_1',
            on: {
              ON_CLICK_NAVIGATE_TO_FRAME_2: 'Frame_2',
            }
          },
          Frame_2:{
            id: 'Frame_2',
            type: 'final'
          },
          Frame_3:{
            id: 'Frame_3',
            type: 'final'
          },
          Frame_4:{
            id: 'Frame_4',
            type: 'final'
          },
        }
      }"
    `,
    )
  })

  it('when passed with the options generated from the "Click and drag frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          { id: '1:2', name: 'Frame 1', framesChildren: [] },
          { id: '1:3', name: 'Frame 2', framesChildren: [] },
          { id: '1:4', name: 'Frame 3', framesChildren: [] },
          { id: '1:5', name: 'Frame 4', framesChildren: [] },
        ],
        interactiveNodes: [
          {
            node: { id: '1:8' },
            parentFrameId: '1:2',
            triggerType: 'ON_CLICK',
            destinationFrameId: '1:3',
            navigationType: 'NAVIGATE',
            generatedName: 'Click to navigate to Frame 2',
          },
          {
            node: { id: '1:12' },
            parentFrameId: '1:3',
            triggerType: 'ON_DRAG',
            destinationFrameId: '1:2',
            navigationType: 'NAVIGATE',
            generatedName: 'Drag to navigate to Frame 1',
          },
        ],
      },
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id: 'Page_1',
        initial: 'Frame_1',
        states: {
          Frame_1:{
            id: 'Frame_1',
            on: {
              ON_CLICK_CLICK_TO_NAVIGATE_TO_FRAME_2: 'Frame_2',
            }
          },
          Frame_2:{
            id: 'Frame_2',
            on: {
              ON_DRAG_DRAG_TO_NAVIGATE_TO_FRAME_1: 'Frame_1',
            }
          },
          Frame_3:{
            id: 'Frame_3',
            type: 'final'
          },
          Frame_4:{
            id: 'Frame_4',
            type: 'final'
          },
        }
      }"
    `,
    )
  })

  it.todo('mouseEvent reactions: these reactions work the same as Drag event, no need to test them')

  it.skip('when passed with the options generated from the "Touch up with delay frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          { id: '1:2', name: 'Frame 1', framesChildren: [] },
          { id: '1:3', name: 'Frame 2', framesChildren: [] },
          { id: '207:8', name: 'Frame 3', framesChildren: [] },
        ],
        interactiveNodes: [
          {
            node: { id: '1:8' },
            parentFrameId: '1:2',
            triggerType: 'MOUSE_UP',
            destinationFrameId: '1:3',
            navigationType: 'NAVIGATE',
            generatedName: 'Navigate to Frame 2',
            delay: 2000,
          },
          {
            node: { id: '207:11' },
            parentFrameId: '1:2',
            triggerType: 'ON_CLICK',
            destinationFrameId: '207:8',
            navigationType: 'NAVIGATE',
            generatedName: 'Navigate to Frame 3',
          },
        ],
      },
    }

    createXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id: 'Page_1',
        initial: 'Frame_1',
        states: {
          Frame_1:{
            on: {
              ON_CLICK_NAVIGATE_TO_FRAME_3: 'Frame_3',
              MOUSE_UP_NAVIGATE_TO_FRAME_2: '#Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000',
            }
            ,
            id: 'Frame_1',
            initial: 'idle',
            states: {
              idle:{
              },
              MOUSE_UP_NAVIGATE_TO_FRAME_2_AFTER_2000:{
                after: {
                  2000: '#Page_1.Frame_2',
                }
              },
            }
          },
          Frame_2:{
            type: 'final'
          },
          Frame_3:{
            type: 'final'
          },
        }
      }"
    `,
    )
  })
})
