import { observer } from 'mobx-react-lite'
import React from 'react'

export const TreeLike = observer(({ getNodesAt, renderNode }) => {
  return (
    <div className="">
      <div className="f4 pa3">TreeLike:</div>
      <div className="">{getNodesAt(0).map(renderNode)}</div>
    </div>
  )
})

TreeLike.displayName = 'TreeLike'
