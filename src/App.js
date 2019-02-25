import React from 'react'
import { observer } from 'mobx-react-lite'
import { autorun, observable, toJS } from 'mobx'
import * as R from 'ramda'
import faker from 'faker'
import * as nanoid from 'nanoid'
import validate from 'aproba'
import { getCached, setCache } from './cache-helpers'

// import clsx from 'clsx'

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

// const pickXY = R.pick(['x', 'y'])
// const pickSize = R.pick(['width', 'height'])

const Inspect = observer(({ data }) => {
  const Ins = R.is(Array)(data) ? InspectArray : InspectObject
  return (
    <pre className="">
      <Ins data={data} />
    </pre>
  )
})

const StringValue = observer(({ value }) => {
  return (
    <div className="flex">
      <div className="white">"</div>
      <div className="red">{`${value}`}</div>
      <div className="white">"</div>
    </div>
  )
})

StringValue.displayName = 'StringValue'

const PrimitiveValue = observer(({ value }) => {
  return <div className="">{`${value}`}</div>
})

PrimitiveValue.displayName = 'PrimitiveValue'

const UnknownValue = observer(({ value }) => {
  return R.type(value)
})

UnknownValue.displayName = 'UnknownValue'

const InspectValue = observer(({ value }) => {
  const compLookup = {
    String: StringValue,
    Boolean: PrimitiveValue,
    Number: PrimitiveValue,
  }
  const valueType = R.type(value)
  const Comp = R.propOr(UnknownValue, valueType)(compLookup)
  return <Comp value={value} />
})

InspectValue.displayName = 'InspectValue'

const InspectObject = observer(({ data }) => {
  const kvPairs = R.toPairs(data)
  return (
    <pre className="">
      {kvPairs.map(([key, value]) => {
        const isComplexType = R.is(Object)(value)
        return (
          <div key={key} className="flex items-center">
            <div
              style={{
                fontSize: '0.6em',
                lineHeight: 1,
                position: 'relative',
                top: '0.2em',
              }}
            >
              {isComplexType ? '► ' : '  '}
            </div>
            <div style={{ color: '#E173E9' }}>{`${key}`}</div>:
            <div className="ml1">
              <InspectValue value={value} />
            </div>
          </div>
        )
      })}
    </pre>
  )
})

const InspectArray = observer(({ data }) => {
  debugger
  return <pre className="">{JSON.stringify(data, null, 2)}</pre>
})

Inspect.displayName = 'Inspect'

const InspectorPanel = observer(() => {
  return (
    <div
      className="bg-black-80 white"
      style={{
        height: '25vh',
        position: 'fixed',
        bottom: 0,
        width: '100vw',
      }}
    >
      <div className="h-100 flex flex-row" style={{ fontSize: 12 }}>
        <div className="overflow-scroll  w-50">
          <Inspect data={store.inspected} />
        </div>
        <div className="overflow-scroll  w-50">
          <Inspect data={store} />
        </div>
      </div>
    </div>
  )
})

InspectorPanel.displayName = 'InspectorPanel'

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
      {store.rows.map(renderRow)}
      <InspectorPanel />
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
