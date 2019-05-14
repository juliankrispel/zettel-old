import { getBlock } from '../queries'
import { isCollapsed } from '../selection'
import { removeRange } from '../mutations'

import { EditorState, SelectionState } from '../types'

const reg = /(?:[^\s]+\s?$)|(?:\s\s+$)/

export default function handleBackspaceWord (editorState: EditorState) {
  if (!isCollapsed(editorState.selection)) {
    throw new Error('handleBackspaceWord only handles collapsed selections')
  }

  const currentBlock = getBlock(editorState.content, editorState.selection.startKey)

  if (currentBlock == null) {
    return
  }

  const textUntilCursor = currentBlock.text.slice(0, editorState.selection.startOffset)
  const match = textUntilCursor.match(reg)
  const selection: SelectionState = {
    ...editorState.selection,
    startOffset: match != null && typeof match.index === 'number' ? match.index : 0
  }

  removeRange(
    editorState,
    selection
  )
}
