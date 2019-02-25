import React from 'react'
import { observer } from 'mobx-react-lite'
import { observable } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'
import validate from 'aproba'

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
})

function hotDispose(disposer) {
  validate('F', arguments)
  if (module.hot) {
    module.hot.dispose(R.tryCatch(disposer, console.error))
  }
}

hotDispose(() => {
  console.log('Disposing')
})

const Row = observer(({ row }) => {
  return <div className="ma3">{row.name}</div>
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
    </div>
  )
}

export default observer(App)
