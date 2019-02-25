import React from 'react'
import { observer } from 'mobx-react-lite'
import { autorun, observable, toJS } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'
import validate from 'aproba'
import { getCached, setCache } from './cache-helpers'
import { _ } from 'param.macro'
import { Rnd } from 'react-rnd'
import clsx from 'clsx'

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
  inspected: null,
  inspectorBounds: { x: 0, y: 0, width: '100vw', height: 150 },
  inspector: {
    selecting: false,
  },
})

initStore()
// store.inspectorBounds.x = 0
// store.inspectorBounds.y = 0

const pickXY = R.pick(['x', 'y'])
const pickSize = R.pick(['width', 'height'])

const Inspector = observer(() => {
  return (
    <Rnd
      className={clsx('f7')}
      size={pickSize(store.inspectorBounds)}
      position={{
        x: store.inspectorBounds.x,
        y: store.inspectorBounds.y,
      }}
      onDragStop={(e, d) => {
        store.inspectorBounds.x = d.x
        store.inspectorBounds.y = d.y
      }}
      onResize={(e, direction, ref, delta, position) => {
        Object.assign(store.inspectorBounds, pickSize(ref.style), position)
      }}
      // dragHandleClassName={'drag-handle'}
    >
      <div
        className="overflow-scroll pa3 flex flex-column bg-black-80 white"
        style={{ height: store.inspectorBounds.height }}
      >
        <pre>
          {R.compose(
            JSON.stringify(_, null, 2),
            toJS,
            // it.iObj,
          )(store)}
        </pre>
      </div>
    </Rnd>
  )
})

Inspector.displayName = 'Inspector'

function inspectObject(row) {
  return (store.inspected = row)
}

const Row = observer(({ row }) => {
  return (
    <div className="ma3" onClick={() => inspectObject(row)}>
      {row.name}
    </div>
  )
})

Row.displayName = 'Row'

function renderRow(row) {
  return <Row key={row.id} row={row} />
}

function App() {
  return (
    <div
      className="relative"
      style={{ minHeight: '100vh' }}
      onClick={e => {
        if (store.inspector.selecting) {
          store.inspector.selecting = false
        }
      }}
    >
      <h1 className="ma0">ReactDataP1</h1>
      {store.rows.map(renderRow)}
      <Inspector />
    </div>
  )
}

export default observer(App)

function hotDispose(disposer) {
  validate('F', arguments)
  if (module.hot) {
    module.hot.dispose(R.tryCatch(disposer, console.error))
  }
}

function initStore() {
  function getCachedStore() {
    return R.compose(
      R.omit(['']),
      R.defaultTo({}),
      getCached,
    )('store')
  }

  Object.assign(store, getCachedStore())

  hotDispose(
    autorun(() => {
      setCache('store', toJS(store))
    }),
  )
}
