import { EditorState, SelectionState } from '../types'

export default function updateSelection(
  editorState: EditorState,
  update: SelectionState
) {
  Object.assign(
    editorState.selection,
    update
  )
}
