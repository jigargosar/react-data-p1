import React from 'react'
import { observer } from 'mobx-react-lite'
import { autorun, observable, toJS } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'
import validate from 'aproba'
import { getCached, setCache } from './cache-helpers'
import { _, it } from 'param.macro'

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
  iObj: null,
})

initStore()

const Inspector = observer(() => {
  return (
    <div className="pa3">
      <pre>
        {R.compose(
          JSON.stringify(_, null, 2),
          toJS,
          it.iObj,
        )(store)}
      </pre>
    </div>
  )
})

Inspector.displayName = 'Inspector'

function inspectObject(row) {
  return (store.iObj = row)
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
      <h1>ReactDataP1</h1>
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
      R.pick(['rows']),
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
