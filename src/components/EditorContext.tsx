// @flow

import { createContext } from 'react'

import {
  RenderFragment,
  RenderBlock,
  EditorState,
  Block
} from '../types'

type EditorContextType = {
  block?: Block,
  editorState?: EditorState,
  renderFragment?: RenderFragment,
  renderBlock?: RenderBlock,
}

const EditorContext = createContext<EditorContextType>({})

export default EditorContext
