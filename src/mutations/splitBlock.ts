import { EditorState, SelectionState, CharacterData } from '../types'
import removeRange from './removeRange'
import { getBlock } from '../queries'
import { isCollapsed } from '../selection'
import { createBlock } from '../create'
import updateBlock from './updateBlock'
import insertBlockAfter from './insertBlockAfter'

export default function splitBlock(editorState: EditorState, selection: SelectionState): void {
  if (!isCollapsed(selection)) {
    removeRange(editorState, selection)
  }

  const { content } = editorState
  const { startOffset, endOffset, startKey } = selection

  const currentBlock = getBlock(content, startKey)

  if (currentBlock == null) {
    return
  }

  const { key: currentKey, ...blockToSplit } = currentBlock

  const textBefore = blockToSplit.text.slice(0, startOffset)
  const charDataBefore = blockToSplit.characterData.slice(0, startOffset)
  const textAfter = blockToSplit.text.slice(endOffset)
  const charDataAfter: CharacterData[] = blockToSplit.characterData.slice(endOffset)

  const newBlock = createBlock({
    ...blockToSplit,
    characterData: charDataAfter,
    text: textAfter
  })

  updateBlock(editorState, currentKey, {
    text: textBefore,
    characterData: charDataBefore,
    children: []
  })
  insertBlockAfter(editorState, currentKey, newBlock)

  editorState.selection = {
    startKey: newBlock.key,
    endKey: newBlock.key,
    startOffset: 0,
    endOffset: 0
  }
}
