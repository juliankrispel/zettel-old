import React, { Fragment, Component, createRef, ReactEventHandler, KeyboardEventHandler } from 'react'
import { produce } from 'immer'

import EditorContext from './EditorContext'
import { getDomSelection, setDomSelection } from '../selection'
import handleKeyDown from '../handleKeyDown'
import shallowEqual from '../shallowEqual'
import { createTextFragments } from '../create'
import { getPreviousCharacterData } from '../queries'
import hasEqualCharacterData from '../hasEqualCharacterData'
import EditorBlockChildren from './EditorBlockChildren'
import EditorBlock from './EditorBlock'

import {
  RenderFragment,
  RenderBlock,
  EditorState,
  Block
} from '../types'


type Props = {
  onChange: (editorState: EditorState) => void,
  editorState: EditorState,
  renderBlock?: RenderBlock,
  renderFragment?: RenderFragment
}

const editorStyles: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  userSelect: 'text',
  outline: 'none'
}

/*
const blockStyles = {
  outline: 'none',
  userSelect: 'text',
  whiteSpace: 'pre-wrap',
  display: 'block',
  position: 'relative',
  overflowWrap: 'break-word'
}
*/

export default class Editor extends Component<Props> {
  ref: React.RefObject<HTMLDivElement> = createRef()

  static defaultProps = {
    renderBlock: EditorBlock
  }

  onKeyDown: KeyboardEventHandler<HTMLDivElement>  = (event): void => {
    const { editorState, onChange } = this.props
    onChange(handleKeyDown(editorState, event))
  }

  componentDidUpdate() {
    const { editorState } = this.props
    if (editorState.selection != null && this.ref.current != null) {
      setDomSelection(this.ref.current, editorState.selection)
    }
  }

  renderBlock = (block: Block): React.ReactNode => {
    const { key, text, children } = block
    let textNode: React.ReactNode = text || <br />

    const {
        renderFragment: _RenderFragment,
        renderBlock: _RenderBlock,
    } = this.props;

    if (text != null && text.length > 0) {
      const fragments = createTextFragments(block, this.props.editorState.entityMap)

      let offset = 0

      textNode = fragments.map(fragment => {
        let textFragment: React.ReactNode = <span
          data-block-key={key}
          data-fragment-start={offset}
          data-fragment-end={offset + fragment.text.length}
        >{fragment.text || <br />}</span>
        if (_RenderFragment) {
          textFragment = <_RenderFragment {...{children: textFragment, fragment }} />
        }
        offset += fragment.text.length
        return textFragment
      })
    } else {
      textNode = <span
        data-block-key={key}
        data-fragment-start={0}
        data-fragment-end={0}
      ><br /></span>
    }

    let renderedChildren: React.ReactNode = null
    let renderedElement: React.ReactNode = null

    if (Array.isArray(children)) {
      renderedChildren = children.map(this.renderBlock)
    }

    if (typeof text === 'string') {
      renderedElement = <Fragment key={key}>
        <span>{textNode}</span>
        {renderedChildren}
      </Fragment>
    }

    if (_RenderBlock) {
      return <_RenderBlock {...{ children: renderedElement, block }} />
    }

    return renderedElement
  }

  handleSelectionChange: ReactEventHandler<HTMLDivElement> = (event): void => {
    const { editorState, onChange } = this.props
    const { selection } = editorState
    const domSelection = getDomSelection(editorState)

    if (domSelection != null && !shallowEqual(selection, domSelection)) {
      onChange(produce(editorState, draft => {
        const previousCharacterData = getPreviousCharacterData(editorState.content, domSelection)

        if (!hasEqualCharacterData(previousCharacterData, editorState.currentCharacterData)) {
          draft.currentCharacterData = {
              marks: [],
              ...previousCharacterData
          }
        }

        draft.selection = domSelection
      }))
    }
  }

  render() {
    const { editorState } = this.props

    if (!editorState) {
      throw new Error('editorState prop must be defined')
    }

    const content = editorState.content

    const contextProps = {
      editorState: this.props.editorState,
      renderFragment: this.props.renderFragment,
      renderBlock: this.props.renderBlock
    }

    return <EditorContext.Provider
      value={contextProps}>
      <div
        ref={this.ref}
        style={editorStyles}
        onMouseUp={this.handleSelectionChange}
        suppressContentEditableWarning
        contentEditable
        onSelect={this.handleSelectionChange}
        onKeyDown={this.onKeyDown}>
        <EditorBlockChildren content={content} />
      </div>
    </EditorContext.Provider>
  }
}
