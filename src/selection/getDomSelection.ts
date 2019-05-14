import { EditorState, SelectionState } from '../types'
import { getBlockMap } from '../queries'

interface ElementWithDataSet extends HTMLElement {
  readonly dataset: {
    fragmentStart: string,
    blockKey: string
  }
}

const getFragmentNode = (el: HTMLElement | null): ElementWithDataSet | null => {
  if (el == null) {
    return null
  }
  if (el.dataset && el.dataset.blockKey != null && el.dataset.fragmentStart != null) {
    const _el: any = el
    return _el
  } else if (el.parentElement) {
    return getFragmentNode(el.parentElement)
  }
  return null
}

export default function getDomSelection({ content, selection }: EditorState): SelectionState {
  const domSelection = window.getSelection()

  if (domSelection == null || domSelection.anchorNode == null) {
    return selection
  }

  const {
    anchorOffset,
    focusOffset
  } = domSelection

  const _anchorNode: any = domSelection.anchorNode
  const _focusNode: any = domSelection.focusNode
  const anchorNode = getFragmentNode(_anchorNode)
  const focusNode = getFragmentNode(_focusNode)

  if (anchorNode == null || focusNode == null) {
    return selection
  }

  const anchorKey = anchorNode.dataset.blockKey
  const focusKey = focusNode.dataset.blockKey

  const anchorFragmentOffset = parseInt(anchorNode.dataset.fragmentStart)
  const focusFragmentOffset = parseInt(focusNode.dataset.fragmentStart)

  const keys = Object.keys(getBlockMap(content))
  const anchorIndex = keys.indexOf(anchorKey) + anchorFragmentOffset
  const focusIndex = keys.indexOf(focusKey) + focusFragmentOffset

  let startOffset = anchorOffset + anchorFragmentOffset
  let endOffset = focusOffset + focusFragmentOffset
  let startKey = anchorKey
  let endKey = focusKey

  const reverse = anchorIndex > focusIndex

  if (reverse === true) {
    startKey = focusKey
    endKey = anchorKey
    startOffset = focusOffset + focusFragmentOffset
    endOffset = anchorOffset + anchorFragmentOffset
  }

  return {
    startOffset,
    endOffset,
    startKey,
    endKey
  }
}
