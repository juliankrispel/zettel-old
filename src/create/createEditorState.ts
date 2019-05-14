import { produce } from 'immer'
import { RawContentState, EditorState } from '../types'
import createBlock from './createBlock'

const emptyState: any = {
  content: [],
  entityMap: {},
  selection: {
    startKey: 'a',
    endKey: 'a',
    startOffset: 0,
    endOffset: 0
  },
  changes: [],
  changeIndex: -1,
  currentCharacterData: {
    marks: []
  },
  lastCommitted: ''
}

const createEditorState = (rawContent: RawContentState): EditorState => {
  const content = rawContent.blocks.map(createBlock)

  const key = content[0].key
  const selection = {
    startKey: key,
    endKey: key,
    startOffset: 0,
    endOffset: 0
  }

  const initialState: EditorState = produce(emptyState,
    () => ({
      content,
      entityMap: rawContent.entityMap,
      selection,
      changes: [],
      changeIndex: 0,
      currentCharacterData: {
        marks: [],
      },
      lastCommitted: ''
    }))

  return initialState
}

export default createEditorState
