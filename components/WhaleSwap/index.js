import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { PageWrapper } from 'components/styles'
import Tabs from './Tabs'
import WhaleList from './WhaleList'

const BG = styled.div`
  background: #f0f0f0;
`

const Wrapper = styled(PageWrapper)`
  width: 100%;
  max-width: 1016px;
  min-height: 646px;
  margin: auto;
`

export default connect((state) => state)(function WhaleSwap({ metamask: { address }, auctions: library, dispatch }) {
  const [active, setActive] = useState('new')

  return (
    <>
      <BG className="bg flex-all"></BG>
      <Wrapper className="center">
        <div className="header">
          <h1>WhaleSwap Admin</h1>
          <div className="actions">

          </div>
        </div>
        <Tabs
          tab={active}
          onTab={setActive}
          options={[
            {
              value: 'new',
              label: 'New',
            },
            {
              value: 'activated',
              label: 'Activated',
            },
            {
              value: 'archived',
              label: 'Archived',
            },
          ]}
        />
        <WhaleList
          whales={[
            {
              id: 1,
              logo: '/assets/logo.svg',
              name: 'Rare NFT',
            },
            {
              id: 2,
              logo: '/assets/logo.svg',
              name: 'Unique NFT',
            },
            {
              id: 3,
              logo: '/assets/logo.svg',
              name: 'Superare NFT',
            },
          ]}
        />
      </Wrapper>
    </>
  )
})
