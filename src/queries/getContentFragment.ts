import { SelectionState, ContentState, Block, RawContentState } from '../types'
import createBlock from '../create/createBlock'
import getBlockListInRange from './getBlockListInRange'

const set = (content: Block[] | null, path: number[], value: any): Block[] => {
  const [index, ...rest] = path

  if (content == null) {
    return []
  }

  if (rest.length === 0) {
    content[index] = value
    return content.filter(val => val != null)
  } else if (content[Number(index)] == null) {
    content[index] = createBlock({
      text: '',
    })
  } else if (content[index].children == null) {
    content[index].children = []
  }

  return set(content[index].children || null, rest, value)
}

export default function(
  content: ContentState,
  selection: SelectionState
): ContentState {
  let fragment: ContentState = [];
  const blocks = getBlockListInRange(content, selection)

  blocks.forEach(({ key, block, path }) => {
    const _block = {...block}

    if (key === selection.endKey) {
      _block.characterData = _block.characterData.slice(0, selection.endOffset)
      _block.text = _block.text.slice(0, selection.endOffset)
    }

    if (key === selection.startKey) {
      _block.characterData = _block.characterData.slice(selection.startOffset)
      _block.text = _block.text.slice(selection.startOffset)
    }

    fragment = set(fragment, path, _block)
  })

  return fragment
}