// --------------------------------------------------
// TYPES
// --------------------------------------------------

/**
 * Contain all the Figma prototype-related but agnostic data useful to generate the state machine.
 * The object is a proxy between the traversed Figma document and the state machine generators.
 */
export interface FigmaAgnosticDescriptor {
  readonly pageName: string
  readonly simplifiedFrames: SimplifiedFrame[]
  readonly interactiveNodes: InteractiveNode[]
}

type SimplifiedFrame = Pick<FrameNode, 'id' | 'name'>
type DelayInMilliseconds = number

export type InteractiveNode = InteractiveNodeCommonProperties & InteractiveNodeTriggerProperties & InteractiveNodeNavigationProperties

export interface InteractiveNodeCommonProperties {
  node: SceneNode
  parentFrameId: string
  destinationFrameId: string

  // The node name or the name of the first text element found inside
  generatedName: string
}

export type InteractiveNodeTriggerProperties = {
  triggerType: 'ON_CLICK' | 'ON_DRAG'
}
| {
  triggerType: 'MOUSE_ENTER' | 'MOUSE_LEAVE' | 'MOUSE_UP' | 'MOUSE_DOWN'

  // In the Figma UI, the delay can be set only if the device is mobile and the events are
  // MOUSE_LEAVE, MOUSE_ENTER, TOUCH_DOWN, TOUCH_UP even if the TOUCH events are typed as mouse
  // ones. It's better to specify this detail in the docs
  delay?: DelayInMilliseconds
}

type InteractiveNodeNavigationProperties = {
  navigationType: 'NAVIGATE'
} | {
  navigationType: 'SCROLL_TO'
  destinationNodeId: string
}

// --------------------------------------------------
// GUARDS
// --------------------------------------------------

export function isFrame(node: SceneNode): node is FrameNode {
  return node.type === 'FRAME'
}

export function isGroup(node: SceneNode): node is GroupNode {
  return node.type === 'GROUP'
}
