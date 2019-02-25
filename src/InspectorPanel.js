import { observer } from 'mobx-react-lite'
import { Inspect } from './Inspect'
import React from 'react'

export const InspectorPanel = observer(({ store }) => {
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
