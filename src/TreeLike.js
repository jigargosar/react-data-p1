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

  return renderNodesAt({ level: 0, parentNode: null })
})

TreeLike.displayName = 'TreeLike'
