import { Block, ContentState } from '../types'

export default function getBlockByPath(
  content: ContentState | Block,
  path: Array<number>
): Block | null {
  return path.reduce((
    obj: ContentState | Block | null,
    index: number
  ): Block | null => {
    if (obj == null) {
      return null
    } else if (Array.isArray(obj)) {
      return obj[index]
    } else if (Array.isArray(obj.children)) {
      return obj.children[index] || null
    }

    return null
  }, content)
}
