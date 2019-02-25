import React from 'react'
import { observer } from 'mobx-react-lite'
import { observable } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'

function createFakeRow() {
  return { id: nanoid(), name: faker.name.findName() }
}

const store = observable.object({
  rows: R.times(createFakeRow)(10),
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
