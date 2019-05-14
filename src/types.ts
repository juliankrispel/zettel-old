import React from 'react'
import { Patch } from 'immer'

export type SelectionState = {
  startOffset: number,
  endOffset: number,
  startKey: string,
  endKey: string
}

export type CharacterData = {
  marks: string[],
  entity?: string
}

export type TextFragment = CharacterData & {
  text: string,
}

export type Block = {
  key: string,
  text: string,
  characterData: CharacterData[],
  type?: string,
  data?: Object,
  children?: Array<Block>
}

export type BlockList = {
  path: Array<number>,
  key: string,
  block: Block
}[]

export type BlockMap = {
  [key: string]: {
    path: Array<number>,
    block: Block
  }
}

export type Entity = {
  type: string,
  mutable: boolean,
  data: any
}

export type EntityMap = {
  [key: string]: Entity
}

export type ContentState = Array<Block>

export type CharacterRange = {
  offset: number,
  length: number,
  marks?: Array<string>,
  entity?: string
}

export type RawBlock = {
  text: string,
  type?: string,
  key?: string,
  data?: Object,
  characterRanges?: CharacterRange[],
  characterData?: CharacterData[]
  children?: Array<RawBlock>
}

export type RawContentState = {
  blocks: Array<RawBlock>,
  selection: SelectionState,
  entityMap?: EntityMap
}

export type EditorState = {
  content: ContentState,
  entityMap: EntityMap,
  selection: SelectionState,
  currentCharacterData: CharacterData,
  changes: Array<{
    forward: Array<Patch>,
    reverse: Array<Patch>,
  }>,
  changeIndex: number,
  lastCommitted: string | void
}

type RenderBlockProps = {
    block?: Block,
    editorState?: EditorState,
    renderFragment?: RenderFragment,
    children?: React.ReactNode,
}
export type RenderBlock = React.ComponentType<RenderBlockProps>

export type RenderFragment = React.ComponentType<{
    fragment: TextFragment,
    children: React.ReactNode,
}>
