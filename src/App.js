import React from 'react'
import { observer } from 'mobx-react-lite'
import { autorun, observable, toJS } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'
import validate from 'aproba'
import { getCached, setCache } from './cache-helpers'
import { InspectorPanel } from './InspectorPanel'
import { TreeLike } from './TreeLike'

// import clsx from 'clsx'

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
  inspected: null,
})

initStore()

function inspectObject(row) {
  return (store.inspected = row)
}

const Row = observer(({ row }) => {
  return (
    <div
      className="pv2 ph3"
      onClick={() => inspectObject(row)}
      tabIndex={0}
    >
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
    <div className="vh-100">
      <h1 className="ma0">ReactDataP1</h1>
      <TreeLike
        getNodesAt={level => {
          if (level === 0) {
            return store.rows
          }
        }}
        renderNode={row => {
          return <Row key={row.id} row={row} />
        }}
      />
      {store.rows.map(renderRow)}
      {false && <InspectorPanel store={store} />}
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
