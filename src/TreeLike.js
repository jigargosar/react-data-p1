import { observer } from 'mobx-react-lite'
import React from 'react'

export const TreeLike = observer(function TreeLike({
  getNodesAt,
  renderNode,
}) {
  return (
    <div className="">
      <div className="f4 pa3">TreeLike:</div>
      <div className="">
        {getNodesAt({ level: 0 }).map(node => {
          return <>{renderNode({ node, level: 0 })}</>
        })}
      </div>
    </div>
  )
})

TreeLike.displayName = 'TreeLike'
