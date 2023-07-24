import { isGroup, type NavigateOnClickNode } from './types'

export function generateGroupName(node: GroupNode) {
  const groupHasGenericName = /^Group\s\d+$/.test(node.name)
  if (!groupHasGenericName) return node.name

  let childName = ''

  node.findAll((child) => {
    if (childName) return false

    console.log(child.type, child.name)
    if (child.type === 'TEXT') childName = child.name

    return false
  })

  return childName || node.name
}

export function normalizeString(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, '_')
}

export function matchElementThatNavigateOnClick(
  mutableElementsThatNavigate: NavigateOnClickNode[],
  node: SceneNode,
  parentFrame: FrameNode
) {
  if (!('reactions' in node)) return

  for (const reaction of node.reactions) {
    if (!reaction.action) continue
    if (reaction.action.type !== 'NODE') continue
    if (reaction.action.navigation !== 'NAVIGATE') continue
    if (!reaction.action.destinationId) continue

    mutableElementsThatNavigate.push({
      node,
      destinationFrameId: reaction.action.destinationId,
      parentFrame,
      name: isGroup(node) ? generateGroupName(node) : node.name,
    })

    break
  }
}
