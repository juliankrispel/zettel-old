import {
  isCollapsed
} from '../selection'

import {
  insertText,
  replaceText,
  splitBlock
} from '../mutations'

import {
  commit,
  undo,
  redo
} from '../history'

import handleBackspace from './handleBackspace'
import handleBackspaceLine from './handleBackspaceLine'
import handleBackspaceWord from './handleBackspaceWord'
import handleDelete from './handleDelete'

import { EditorState } from '../types'

const actionKeys = ['Backspace', 'Delete', 'Meta', 'Alt', 'Enter', 'Control', 'Shift', 'Tab', 'Escape', 'CapsLock']

const isCharacterInsert = (e: KeyboardEvent) =>
  !e.altKey &&
  !e.metaKey &&
  !e.ctrlKey &&
  !e.key.includes('Arrow') &&
  !actionKeys.includes(e.key)

const isCopy = (e: KeyboardEvent) => e.metaKey && e.key === 'c'
const isPaste = (e: KeyboardEvent) => e.metaKey && e.key === 'v'

const isUndo = (e: KeyboardEvent) => !e.shiftKey && e.metaKey && e.key === 'z'
const isRedo = (e: KeyboardEvent) => e.shiftKey && e.metaKey && e.key === 'z'

export default function handleKeyDown (editorState: EditorState, event: KeyboardEvent): EditorState {
  let newEditorState = null

  console.log(event.metaKey, event.key)

  if (isUndo(event)) {
    newEditorState = undo(editorState)
  } else if (isRedo(event)) {
    newEditorState = redo(editorState)
  } else if (event.key === 'Backspace' && event.metaKey === true) {
    newEditorState = commit(editorState, handleBackspaceLine)
  } else if (event.key === 'Backspace' && event.altKey === true) {
    newEditorState = commit(editorState, handleBackspaceWord)
  } else if (event.key === 'Backspace') {
    newEditorState = commit(editorState, handleBackspace)
  } else if (event.key === 'Enter') {
    newEditorState = commit(editorState, splitBlock, editorState.selection)
  } else if (event.key === 'Delete') {
    newEditorState = commit(editorState, handleDelete)
  } else if (isCharacterInsert(event) && isCollapsed(editorState.selection)) {
    newEditorState = commit(editorState, insertText, editorState.selection, event.key, editorState.currentCharacterData)
  } else if (isCharacterInsert(event)) {
    newEditorState = commit(editorState, replaceText, editorState.selection, event.key)
  } else if (isCopy(event)) {
    console.log('copy')
    // const ev: ClipboardEvent = event;
    // ev.clipboardData.setData('application/json', )
    // handle copy

  } else if (isPaste(event)) {
    console.log('paste')
    // handle paste
  }

  if (newEditorState != null) {
    event.preventDefault()
    return newEditorState
  }

  return editorState
}
