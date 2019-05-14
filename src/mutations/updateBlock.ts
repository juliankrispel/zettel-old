import { EditorState, Block } from '../types'
import { getBlock } from '../queries'

export default function updateBlock(
  editorState: EditorState,
  key: string,
  blockUpdate: Partial<Block>
) {
  const block = getBlock(editorState.content, key)
  Object.assign(block, blockUpdate)
}
