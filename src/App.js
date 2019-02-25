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

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
  inspected: null,
  inspectorBounds: { x: 0, y: 0, width: '100vw', height: 150 },
})

initStore()

const pickXY = R.pick(['x', 'y'])
const pickSize = R.pick(['width', 'height'])

const Inspector = observer(() => {
  return (
    <Rnd
      size={store.inspectorBounds}
      position={store.inspectorBounds}
      onDragStop={(e, d) => {
        Object.assign(store.inspectorBounds, pickXY(d))
      }}
      onResize={(e, direction, ref, delta, position) => {
        Object.assign(store.inspectorBounds, pickSize(ref.style), position)
      }}
    >
      <div className="overflow-scroll pa3 flex flex-column h-100 bg-black-80 white">
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
    <div className="">
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
