// --------------------------------------------------
// TYPES
// --------------------------------------------------

/**
 * Contain all the Figma prototype-related but agnostic data useful to generate the state machine.
 * The object is a proxy between the traversed Figma document and the state machine generators.
 */
export type FigmaAgnosticDescriptor = {
  readonly pageName: string
  readonly simplifiedFrames: SimplifiedFrame[]
  readonly interactiveNodes: InteractiveNode[]
}

type SimplifiedFrame = Pick<FrameNode, 'id' | 'name'>
type DelayInMilliseconds = number

export type InteractiveNode = {
  node: SceneNode
  parentFrameId: string
  destinationFrameId: string

  // The node name or the name of the first text element found inside
  generatedName: string
} & (
  | {
      triggerType: 'ON_CLICK' | 'ON_DRAG'
    }
  | {
      triggerType: 'MOUSE_ENTER' | 'MOUSE_LEAVE' | 'MOUSE_UP' | 'MOUSE_DOWN'
      delay?: DelayInMilliseconds
    }
)

// --------------------------------------------------
// GUARDS
// --------------------------------------------------

export function isFrame(node: SceneNode): node is FrameNode {
  return node.type === 'FRAME'
}

export function isGroup(node: SceneNode): node is GroupNode {
  return node.type === 'GROUP'
}
