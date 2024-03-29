import { EditorState } from '../types'
import { getBlockParent } from '../queries'

export default function deleteBlock(
  editorState: EditorState,
  key: string
) {
  // get parent
  const { content } = editorState
  const rootIndex = content.map(block => block.key).indexOf(key)

  // if block is root block, just splice it
  if (rootIndex > -1) {
    editorState.content.splice(rootIndex, 1)
  } else {
    const parent = getBlockParent(content, key)

    if (parent == null) {
      return
    }

    const { children } = parent

    if (children != null) {
      const index = children.map(
        block => block.key
      ).indexOf(key)

      children.splice(index, 1)
    }
  }
}
