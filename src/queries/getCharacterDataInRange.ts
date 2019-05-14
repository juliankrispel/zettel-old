import { ContentState, SelectionState, CharacterData } from '../types'
import getBlockListInRange from './getBlockListInRange'

export default function(
  content: ContentState,
  selection: SelectionState
): CharacterData[] {
  const blockList = getBlockListInRange(content, selection)
  const initial: CharacterData[] = []

  return blockList.reduce((acc, { block }, index) => {
    if (blockList.length === 1) {
      return acc.concat(
        block.characterData.slice(selection.startOffset, selection.endOffset)
      )
    } else if (index === 0) {
      return acc.concat(
        block.characterData.slice(selection.startOffset)
      )
    } else if (index === blockList.length - 1) {
      return acc.concat(
        block.characterData.slice(0, selection.endOffset)
      )
    }

    return acc.concat(block.characterData)
  }, initial)
}
