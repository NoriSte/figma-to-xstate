import { describe, expect, it } from 'vitest'
import { type GeneratorOptions, generateXStateV4StateMachineOptions } from './generators'
import { generateNewWriter } from './utils'

describe('generateXStateV4StateMachineOptions', () => {
  it('when passed with an empty list of frames, then throws an error', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'unitTestPage',
        simplifiedFramesTree: [],

      },
    }

    expect(() => generateXStateV4StateMachineOptions(generatorOptions)).toThrowError(
      'The document contains no frames.',
    )
  })

  it('when passed with the options generated from the "Four empty frames" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor:
      {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          { type: 'FRAME', id: '1:2', name: 'Frame 1', reactionsData: [], framesChildren: [] },
          { type: 'FRAME', id: '1:3', name: 'Frame 2', reactionsData: [], framesChildren: [] },
          { type: 'FRAME', id: '1:4', name: 'Frame 3', reactionsData: [], framesChildren: [] },
          { type: 'FRAME', id: '1:5', name: 'Frame 4', reactionsData: [], framesChildren: [] },
        ],
      },
    }

    generateXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(`
      "{
        id:'Page_1',
        initial:'Frame_1',
        states:{
          Frame_1:{
            type:'final',
          },
          Frame_2:{
            type:'final',
          },
          Frame_3:{
            type:'final',
          },
          Frame_4:{
            type:'final',
          },
        },
      }
      ,"
    `)
  })

  it('when passed with the options generated from the "Simple frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [{
          type: 'FRAME',
          id: '1:2',
          name: 'Frame 1',
          reactionsData: [{
            triggerType: 'ON_CLICK',
            navigationType: 'NAVIGATE',
            destinationFrameId: '1:3',
            destinationFrameName: 'Frame 2',
            generatedName: 'Navigate to Frame 2',
          }],
          framesChildren: [],
        }, {
          type: 'FRAME',
          id: '1:3',
          name: 'Frame 2',
          reactionsData: [],
          framesChildren: [],
        }],
      },
    }

    generateXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id:'Page_1',
        initial:'Frame_1',
        states:{
          Frame_1:{
            on:{
              ON_CLICK_NAVIGATE_TO_FRAME_2:'Frame_2',
            },
          },
          Frame_2:{
            type:'final',
          },
        },
      }
      ,"
    `,
    )
  })

  it('when passed with the options generated from the "Click and drag frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [{
          type: 'FRAME',
          id: '1:2',
          name: 'Frame 1',
          reactionsData: [{
            triggerType: 'ON_CLICK',
            navigationType: 'NAVIGATE',
            destinationFrameId: '1:3',
            destinationFrameName: 'Frame 2',
            generatedName: 'Click to navigate to Frame 2',
          }],
          framesChildren: [],
        }, {
          type: 'FRAME',
          id: '1:3',
          name: 'Frame 2',
          reactionsData: [{
            triggerType: 'ON_DRAG',
            navigationType: 'NAVIGATE',
            destinationFrameId: '1:2',
            destinationFrameName: 'Frame 1',
            generatedName: 'Drag to navigate to Frame 1',
          }],
          framesChildren: [],
        }],
      },
    }

    generateXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id:'Page_1',
        initial:'Frame_1',
        states:{
          Frame_1:{
            on:{
              ON_CLICK_CLICK_TO_NAVIGATE_TO_FRAME_2:'Frame_2',
            },
          },
          Frame_2:{
            on:{
              ON_DRAG_DRAG_TO_NAVIGATE_TO_FRAME_1:'Frame_1',
            },
          },
        },
      }
      ,"
    `,
    )
  })

  it.todo('mouseEvent reactions: these reactions work the same as Drag event, no need to test them')

  it('when passed with the options generated from the "Touch up with delay frame navigation" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [{
          type: 'FRAME',
          id: '1:2',
          name: 'Frame 1',
          reactionsData: [{
            triggerType: 'MOUSE_UP',
            generatedName: 'Navigate to Frame 2 with delay',
            delay: 2000,
            navigationType: 'NAVIGATE',
            destinationFrameId: '1:3',
            destinationFrameName: 'Frame 2',
          }, {
            triggerType: 'ON_CLICK',
            navigationType: 'NAVIGATE',
            destinationFrameId: '207:8',
            destinationFrameName: 'Frame 3',
            generatedName: 'Navigate to Frame 3',
          }],
          framesChildren: [],
        }, {
          type: 'FRAME',
          id: '1:3',
          name: 'Frame 2',
          reactionsData: [],
          framesChildren: [],
        }, {
          type: 'FRAME',
          id: '207:8',
          name: 'Frame 3',
          reactionsData: [],
          framesChildren: [],
        }],
      },
    }

    generateXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(
    `
      "{
        id:'Page_1',
        initial:'Frame_1',
        states:{
          Frame_1:{
            id:'Frame_1',
            initial:'idle',
            states:{
              idle:{},
              MOUSE_UP_NAVIGATE_TO_FRAME_2_WITH_DELAY_AFTER_2000:{
                after:{
                  2000:'#Page_1.Frame_2',
                },
              },
            },
            on:{
              ON_CLICK_NAVIGATE_TO_FRAME_3:'Frame_3',
              MOUSE_UP_NAVIGATE_TO_FRAME_2_WITH_DELAY:'#Frame_1.MOUSE_UP_NAVIGATE_TO_FRAME_2_WITH_DELAY_AFTER_2000',
            },
          },
          Frame_2:{
            type:'final',
          },
          Frame_3:{
            type:'final',
          },
        },
      }
      ,"
    `,
    )
  })

  it('when passed with the options generated from the "Simple scroll" Figma file, then use the writer to compose a the corresponding state machine', () => {
    const writer = generateNewWriter()

    const generatorOptions: GeneratorOptions = {
      writer,
      figmaAgnosticDescriptor: {
        pageName: 'Page 1',
        simplifiedFramesTree: [
          {
            type: 'FRAME',
            id: '1:2',
            name: 'Frame 1',
            reactionsData: [
              {
                triggerType: 'ON_CLICK',
                navigationType: 'SCROLL_TO',
                destinationNodeId: '17:31',
                destinationNodeName: 'Anchor 2',
                generatedName: 'scroll to anchor 2',
              },
              {
                triggerType: 'ON_CLICK',
                navigationType: 'SCROLL_TO',
                destinationNodeId: '17:13',
                destinationNodeName: 'Anchor 1',
                generatedName: 'scroll to anchor 1',
              },
              {
                triggerType: 'ON_CLICK',
                navigationType: 'SCROLL_TO',
                destinationNodeId: '17:55',
                destinationNodeName: 'Anchor 3',
                generatedName: 'scroll to anchor 3',
              },
            ],
            framesChildren: [],
          },
        ],
      }
      ,
    }

    generateXStateV4StateMachineOptions(generatorOptions)

    expect(writer.toString()).toMatchInlineSnapshot(`
      "{
        id:'Page_1',
        initial:'Frame_1',
        states:{
          Frame_1:{
            id:'Frame_1',
            initial:'idle',
            states:{
              idle:{},
              Anchor_2:{
              },
              Anchor_1:{
              },
              Anchor_3:{
              },
            },
            on:{
              ON_CLICK_SCROLL_TO_ANCHOR_2_SCROLL_TO:'#Page_1.Frame_1.Anchor_2',
              ON_CLICK_SCROLL_TO_ANCHOR_1_SCROLL_TO:'#Page_1.Frame_1.Anchor_1',
              ON_CLICK_SCROLL_TO_ANCHOR_3_SCROLL_TO:'#Page_1.Frame_1.Anchor_3',
            },
          },
        },
      }
      ,"
    `)
  })
  // TODO: test scroll to deeply nested anchors
  // TODO: test click and delay to deeply nested anchors mixed with scroll (ahd with meaningful names in figma)
})
