import { type NavigateOnClickNode } from './types'
import { normalizeString } from './utils'

type Params = {
  readonly frames: FrameNode[]
  readonly elementsThatNavigate: NavigateOnClickNode[]
}
export function createXStateV4StateMachineOptions(params: Params) {
  const { frames, elementsThatNavigate } = params

  const firstFrame = frames[0]
  if (!firstFrame) {
    console.error('The document contains no frame.')
    return
  }

  let code = `{
  id: '${normalizeString(figma.currentPage.name)}',
  initial: '${normalizeString(firstFrame.name)}',
  states: {`

  for (const frame of frames) {
    const elementsThatNavigateInFrame = elementsThatNavigate.filter(
      (element) => element.parentFrame.id === frame.id
    )
    if (elementsThatNavigateInFrame.length > 0) {
      code += `
      ${normalizeString(frame.name)}: {
      on: {

  `
      for (const elementThatNavigateInFrame of elementsThatNavigateInFrame) {
        const destinationFrame = frames.find(
          ({ id }) => elementThatNavigateInFrame.destinationFrameId === id
        )

        if (!destinationFrame)
          throw new Error(`Frame ${elementThatNavigateInFrame.destinationFrameId} not found`)

        code += `

  ${normalizeString(
    `CLICK_ON_${elementThatNavigateInFrame.name.toUpperCase()}`
  )}: '${normalizeString(destinationFrame.name)}',

  `
      }
      code += `
    },
  },
  `
    } else {
      code += `
    ${normalizeString(frame.name)}: {
      // This frame does not contain anything that navigates to other frames
    },
      `
    }
  }

  code += `
  },
}
`

  return code
}

export function createXStateV4VizCode(params: Params) {
  let code = `
// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

const ${figma.currentPage.name}Machine = Machine(${createXStateV4StateMachineOptions(params)})
  `

  return code
}
