import React from 'react'
import EditorText from './EditorText'
import EditorBlockChildren from './EditorBlockChildren'
import { RenderBlock, Block, EditorState } from '../types'

const EditorBlock: RenderBlock = ()  => {
  return <>
    <EditorText />
    <EditorBlockChildren />
  </>
}

export default EditorBlock