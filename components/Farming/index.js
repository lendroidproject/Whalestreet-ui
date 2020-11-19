import React from 'react'

import PoolList from './PoolList'

export default function Farming() {
  return (
    <>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <PoolList />
    </>
  )
}
