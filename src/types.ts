// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type SimplifiedFrame = Pick<FrameNode, 'id' | 'name'>

export type NavigateOnInteractionNode = {
  node: SceneNode
  parentFrame: FrameNode
  destinationFrameId: string
  triggerType: 'ON_CLICK' | 'ON_DRAG' | 'MOUSE_ENTER' | 'MOUSE_LEAVE' | 'MOUSE_UP' | 'MOUSE_DOWN'

  // The node name or the name of the first text element found inside
  name: string
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
