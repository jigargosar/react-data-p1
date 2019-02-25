import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'

export const TreeLike = observer(function TreeLike({
  getNodesAt,
  getNodeKey,
  renderNode,
}) {
  return (
    <div className="bg-lightest-blue">
      <div className="f4 pa3">TreeLike:</div>
      <div className="">
        {getNodesAt({ level: 0 }).map(node => {
          return (
            <Fragment key={getNodeKey(node)}>
              {renderNode({ node, level: 0 })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
})

TreeLike.displayName = 'TreeLike'
