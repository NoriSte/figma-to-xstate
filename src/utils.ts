import CodeBlockWriter from 'code-block-writer'
import { isGroup } from './types'
import type { ReactionData, ReactionDataCommonProperties, ReactionDataTriggerProperties } from './types'

export function generateNewWriter() {
  return new CodeBlockWriter({
    useTabs: false,
    useSingleQuote: true,
    indentNumberOfSpaces: 2,
  })
}

export function generateNodeName(node: BaseNode) {
  return isGroup(node) ? generateGroupName(node) : node.name
}

function generateGroupName(node: GroupNode) {
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

export function getOnClickReactionData(params: {

  node: SceneNode

}): ReactionData[] {
  const { node } = params

  if (!('reactions' in node))
    return []

  const result: ReactionData[] = []

  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue
    if (reaction.trigger.type !== 'ON_CLICK')
      continue
    if (!reaction.action)
      continue
    if (reaction.action.type !== 'NODE')
      continue
    if (!reaction.action.destinationId)
      continue

    if (reaction.action.navigation === 'NAVIGATE') {
      result.push({
        triggerType: reaction.trigger.type,
        navigationType: reaction.action.navigation,
        destinationFrameId: reaction.action.destinationId,
        destinationFrameName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),
        generatedName: generateNodeName(node),
      })
    }
    if (reaction.action.navigation === 'SCROLL_TO') {
      result.push({
        triggerType: reaction.trigger.type,
        navigationType: reaction.action.navigation,
        destinationNodeId: reaction.action.destinationId,
        destinationNodeName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),
        generatedName: generateNodeName(node),
      })
    }
  }
  return result
}

export function getOnDragReactionData(params: {
  node: SceneNode

}): ReactionData[] {
  const { node } = params

  if (!('reactions' in node))
    return []

  const result: ReactionData[] = []

  for (const reaction of node.reactions) {
    if (!reaction.trigger)
      continue
    if (reaction.trigger.type !== 'ON_DRAG')
      continue
    if (!reaction.action)
      continue
    if (reaction.action.type !== 'NODE')
      continue
    if (!reaction.action.destinationId)
      continue

    if (reaction.action.navigation === 'NAVIGATE') {
      result.push({
        triggerType: reaction.trigger.type,
        navigationType: reaction.action.navigation,
        destinationFrameId: reaction.action.destinationId,
        destinationFrameName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),
        generatedName: generateNodeName(node),
      })
    }
    if (reaction.action.navigation === 'SCROLL_TO') {
      result.push({
        triggerType: reaction.trigger.type,
        navigationType: reaction.action.navigation,
        destinationNodeId: reaction.action.destinationId,
        destinationNodeName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),
        generatedName: generateNodeName(node),
      })
    }
  }

  return result
}

export function getOnMouseEventReactionData(params: {
  node: SceneNode

}): ReactionData[] {
  const { node } = params

  if (!('reactions' in node))
    return []

  const result: ReactionData[] = []

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
    if (!reaction.action.destinationId)
      continue

    const navigationNodeCommonProperties: ReactionDataCommonProperties & ReactionDataTriggerProperties = {
      triggerType: reaction.trigger.type,
      generatedName: generateNodeName(node),
    }

    // TODO: tell the user in case the delay is set to 0
    if (reaction.trigger.delay > 0) {
      // In the Figma UI, the delay can be set only if the device is mobile and the events are
      // MOUSE_LEAVE, MOUSE_ENTER, TOUCH_DOWN, TOUCH_UP even if the TOUCH events are typed as mouse
      // ones. It's better to specify this detail in the docs
      navigationNodeCommonProperties.delay = reaction.trigger.delay * 1000
    }

    if (reaction.action.navigation === 'NAVIGATE') {
      result.push({
        ...navigationNodeCommonProperties,
        navigationType: reaction.action.navigation,
        destinationFrameId: reaction.action.destinationId,
        destinationFrameName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),
      })
      // Can't break because the same node can have multiple mouse reactions
    }
    if (reaction.action.navigation === 'SCROLL_TO') {
      result.push({
        ...navigationNodeCommonProperties,
        navigationType: reaction.action.navigation,
        destinationNodeId: reaction.action.destinationId,
        destinationNodeName: generateNodeName(figma.getNodeById(reaction.action.destinationId)!),

      })
      // Can't break because the same node can have multiple mouse reactions
    }
  }

  return result
}

export function findParentRootFrame(node: BaseNode) {
  const parent = node.parent

  assertIsDefined(parent, `Parentless nodes are not expected (node id: ${node.id})`)

  if (parent.type === 'FRAME' && isRootFrame(parent))
    return parent

  return findParentRootFrame(parent)
}

export function isRootFrame(node: FrameNode) {
  if (node.parent?.type === 'FRAME')
    return false

  return true
}

export function assertIsDefined<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null)
    throw new Error(`${value} is not defined (${errorMessage})`)
}
