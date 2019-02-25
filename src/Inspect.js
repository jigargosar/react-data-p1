import { observer } from 'mobx-react-lite'
import * as R from 'ramda'
import React from 'react'

export const Inspect = observer(({ data }) => {
  const kvPairs = R.toPairs(data)
  return <div className="">{kvPairs.map(renderKeyValuePair)}</div>
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

function renderKeyValuePair([key, value]) {
  const isComplexType = R.is(Object)(value)
  return (
    <>
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
      {isComplexType && <Inspect data={value} />}
    </>
  )
}
