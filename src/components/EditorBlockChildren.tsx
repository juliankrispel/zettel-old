import React, { useContext } from 'react'
import EditorContext from './EditorContext'
import { RenderFragment, RenderBlock, Block } from '../types'

type Props = {
  content?: Array<Block>,
  renderFragment?: RenderFragment,
  renderBlock?: RenderBlock
}

export default function EditorBlockChildren({
  content,
  ...props
}: Props) {
  const {
    block,
    editorState,
    ...contextProps
  } = useContext(EditorContext)

  if (block == null && editorState == null) {
      return <>null</>
  }

  const renderFragment = props.renderFragment || contextProps.renderFragment
  const renderBlock = props.renderBlock || contextProps.renderBlock

  const EditorBlock = renderBlock

  const _children = content || block != null && block.children

  if (Array.isArray(_children) && EditorBlock != null) {
    return <>{_children.map(
      (child, index) => {
        const value = {
          editorState,
          renderFragment,
          renderBlock,
          block: child
        }

        return <EditorContext.Provider
          key={child.key}
          value={value}>
          <EditorBlock
            block={child}
            editorState={editorState}
            renderFragment={renderFragment}
          />
        </EditorContext.Provider>
      }
    )}</>
  }

  return <>null</>
}
