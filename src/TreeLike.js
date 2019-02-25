import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'

export const TreeLike = observer(function TreeLike({
  getNodesAt,
  getNodeKey,
  renderNode,
}) {
  function renderNodesAt({ level, parentNode }) {
    return getNodesAt({ level, parentNode }).map(node => {
      return (
        <Fragment key={getNodeKey({ node, parentNode })}>
          {renderNode({ node, level: level })}
          {renderNodesAt({ level: level + 1, parentNode: node })}
        </Fragment>
      )
    })
  }

  return (
    <div className="bg-lightest-blue">
      <div className="f4 pa3">TreeLike:</div>
      <div className="">
        {renderNodesAt({ level: 0, parentNode: null })}
      </div>
    </div>
  )
})

TreeLike.displayName = 'TreeLike'
