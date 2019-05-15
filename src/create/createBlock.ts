import { RawBlock, Block } from '../types'
import createId from './createId'
import createCharacterData from './createCharacterData'

export default function createBlock (block: RawBlock): Block {
  const { children, text = '', key, characterRanges, ...rest } = block

  if (process.env.NODE_ENV === 'development' && key != null && !isNaN(Number(key))) {
    throw new Error(`block key can not be number ${key}`)
  }

  const newBlock: Block = {
    ...rest,
    text,
    characterData: createCharacterData(block),
    children: [],
    key: key || createId()
  }

  if (Array.isArray(children)) {
    newBlock.children = children.map(createBlock)
  }

  return newBlock
}
