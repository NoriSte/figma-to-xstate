import CodeBlockWriter from 'code-block-writer'
import { type InteractiveNode, isGroup } from './types'

export function generateNewWriter() {
  return new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2,
  })
}

export function generateGroupName(node: GroupNode) {
  const groupHasGenericName = /^Group\s\d+$/.test(node.name)
  if (!groupHasGenericName)
    return node.name

  let childName = ''

  node.findAll((child) => {
    if (childName)
      return false
    if (child.type === 'TEXT')
      childName = child.name

    return false
  })

  return childName || node.name
}

export function normalizeString(str: string) {
  return str.trim().replace(/[^a-zA-Z0-9]/g, '_')
}

export function matchElementThatNavigateOnClick(params: {
  mutableInteractiveNodes: InteractiveNode[]
  node: SceneNode
  parentFrame: FrameNode
}) {
  const { mutableInteractiveNodes, node, parentFrame } = params

  if (!('reactions' in node))
    return

  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue
    if (reaction.trigger.type !== 'ON_CLICK')
      continue
    if (!reaction.action)
      continue
    if (reaction.action.type !== 'NODE')
      continue
    if (reaction.action.navigation !== 'NAVIGATE')
      continue
    if (!reaction.action.destinationId)
      continue

    mutableInteractiveNodes.push({
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name,
    })

    break
  }
}

export function matchElementThatNavigateOnDrag(params: {
  mutableInteractiveNodes: InteractiveNode[]
  node: SceneNode
  parentFrame: FrameNode
}) {
  const { mutableInteractiveNodes, node, parentFrame } = params

  if (!('reactions' in node))
    return

  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue
    if (reaction.trigger.type !== 'ON_DRAG')
      continue
    if (!reaction.action)
      continue
    if (reaction.action.type !== 'NODE')
      continue
    if (reaction.action.navigation !== 'NAVIGATE')
      continue
    if (!reaction.action.destinationId)
      continue

    mutableInteractiveNodes.push({
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name,
    })

    break
  }
}

export function matchElementThatNavigateOnMouseEvent(params: {
  mutableInteractiveNodes: InteractiveNode[]
  node: SceneNode
  parentFrame: FrameNode
}) {
  const { mutableInteractiveNodes, node, parentFrame } = params

  if (!('reactions' in node))
    return

  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue

    if (
      reaction.trigger.type !== 'MOUSE_ENTER'
      && reaction.trigger.type !== 'MOUSE_LEAVE'
      && reaction.trigger.type !== 'MOUSE_UP'
      && reaction.trigger.type !== 'MOUSE_DOWN'
    )
      continue

    if (!reaction.action)
      continue
    if (reaction.action.type !== 'NODE')
      continue
    if (reaction.action.navigation !== 'NAVIGATE')
      continue
    if (!reaction.action.destinationId)
      continue

    const navigationNode: InteractiveNode = {
      node,
      parentFrameId: parentFrame.id,
      triggerType: reaction.trigger.type,
      destinationFrameId: reaction.action.destinationId,
      generatedName: isGroup(node) ? generateGroupName(node) : node.name,
    }

    if (reaction.trigger.delay > 0) {
      // In the Figma UI, the delay can be set only if the device is mobile and the events are
      // MOUSE_LEAVE, MOUSE_ENTER, TOUCH_DOWN, TOUCH_UP even if the TOUCH events are typed as mouse
      // ones. It's better to specify this detail in the docs
      navigationNode.delay = reaction.trigger.delay * 1000
    }

    mutableInteractiveNodes.push(navigationNode)

    // Can't break because the same node can have multiple mouse reactions
    // break
  }
}
