import { createEditorState } from '../../create'
import { SelectionState } from '../../types'
import getContentFragment from '../getContentFragment'

describe.only('getContentFragment', () => {
  describe('returns only selected content', () => {
    test('in flat list', () => {
      const { content } = createEditorState({
        blocks: [{
          key: '1',
          text: 'One'
        }, {
          key: '2',
          text: 'Two'
        }, {
          key: '3',
          text: 'Three'
        }, {
          key: '4',
          text: 'Four'
        }]
      })

      const selection: SelectionState = {
        startKey: '2',
        endKey: '3',
        startOffset: 1,
        endOffset: 3
      }

      expect(getContentFragment(content, selection)).toEqual(createEditorState({
        blocks: [{
          key: '2',
          text: 'wo'
        }, {
          key: '3',
          text: 'Thr'
        }]
      }).content)
    })

    test('in tree', () => {
      const { content } = createEditorState({
        blocks: [{
          key: '1',
          text: 'One',
          children: [{
            key: '2',
            text: 'Two'
          }, {
            key: '3',
            text: 'Three',
            children: [{
              key: '4',
              text: 'Four'
            }]
          }]
        }]
      })

      const selection: SelectionState = {
        startKey: '2',
        endKey: '3',
        startOffset: 1,
        endOffset: 3
      }

      expect(getContentFragment(content, selection)).toEqual(createEditorState({
        blocks: [{
          text: '',
          children: [{
            key: '2',
            text: 'wo'
          }]
        }]
      }).content)
    })
  })
})
