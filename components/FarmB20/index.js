import React from 'react'
import { connect } from 'react-redux'
import { PageWrapper as Wrapper } from 'components/styles'

export default connect((state) => state)(function Farming({}) {
  return (
    <>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <Wrapper className="center">
        <h1>Farm B.20</h1>
        <p className="intro">Yield Farming Pools coming soon ...</p>
      </Wrapper>
    </>
  )
})
