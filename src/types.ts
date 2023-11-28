// --------------------------------------------------
// TYPES
// --------------------------------------------------

/**
 * Contain all the Figma prototype-related but agnostic data useful to generate the state machine.
 * The object is a proxy between the traversed Figma document and the state machine generators.
 */
export interface FigmaAgnosticDescriptor {
  readonly pageName: string
  /**
   * A tree that reflects the Figma document structure, which contains only the frames and the
   * interactive nodes that belong to the frames. Compared to a standard tree, there are multiple
   * root frames.
   */
  readonly simplifiedFramesTree: SimplifiedFrameTree

}

export type SimplifiedFrameTree = SimplifiedFrame[]

export type Child = SimplifiedFrame | SimplifiedNode

export type SimplifiedFrame = Pick<FrameNode, 'id' | 'name'> & {
  type: 'FRAME'
  reactionsData: ReactionData[]
}

export type ReactionData = ReactionDataCommonProperties & ReactionDataTriggerProperties & ReactionDataNavigationProperties

export interface ReactionDataCommonProperties {
  // The node name or the name of the first text element found inside
  generatedName: string
}

export type ReactionDataTriggerProperties = {
  triggerType: 'ON_CLICK' | 'ON_DRAG'
}
| {
  triggerType: 'MOUSE_ENTER' | 'MOUSE_LEAVE' | 'MOUSE_UP' | 'MOUSE_DOWN'

  // In the Figma UI, the delay can be set only if the device is mobile and the events are
  // MOUSE_LEAVE, MOUSE_ENTER, TOUCH_DOWN, TOUCH_UP even if the TOUCH events are typed as mouse
  // ones. It's better to specify this detail in the docs. If the delay is 0, the property is not defined
  delay?: MillisecondsGreaterThanZero
}

type ReactionDataNavigationProperties = {
  navigationType: 'NAVIGATE'
  destinationFrameId: string
  destinationFrameName: string
} | {
  navigationType: 'SCROLL_TO'
  destinationNodeId: string
  destinationNodeName: string
}

type MillisecondsGreaterThanZero = number

export interface SimplifiedNode {
  id: string
  type: 'NODE'
  // The node name or the name of the first text element found inside
  // TODO: is it a generated name or a standard one?
  name: string
}

// --------------------------------------------------
// GUARDS
// --------------------------------------------------

export function isFrame(node: SceneNode): node is FrameNode {
  return node.type === 'FRAME'
}

export function isGroup(node: BaseNode): node is GroupNode {
  return node.type === 'GROUP'
}
