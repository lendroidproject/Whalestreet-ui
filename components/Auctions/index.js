import React, { useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { PageWrapper } from 'components/styles'
import Tabs from './Tabs'
import AuctionList from './AuctionList'
import AuctionTable from './AuctionTable'

const Wrapper = styled(PageWrapper)`
  .tabs {
    margin-top: 16px;
    margin-bottom: 60px;
  }
`

export default connect((state) => state)(function Auctions() {
  const [active, setActive] = useState('ongoing')
  return (
    <>
      <div className="bg flex-all">
        <img src="/assets/bg_auction.jpg" alt="Auctions" />
      </div>
      <Wrapper className="center">
        <h1>Auctions</h1>
        <p className="intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
        </p>
        <Tabs
          tab={active}
          onTab={setActive}
          options={[
            {
              value: 'ongoing',
              label: 'Ongoing',
            },
            {
              value: 'completed',
              label: 'Completed',
            },
          ]}
        />
        {active === 'ongoing' && (
          <AuctionList
            auctions={[
              {
                id: 1,
                epoc: 6,
                price: 27.33,
                expiry: '2020-12-01',
              },
            ]}
          />
        )}
        {active === 'completed' && (
          <AuctionTable
            auctions={[
              {
                id: 1,
                epoc: 6,
                price: 183.03,
                expiry: '2020-12-01',
                purchaes: 20,
                finalPrice: 20.45,
                createdAt: '2020-09-09',
                completedAt: '2020-11-09',
              },
              {
                id: 2,
                epoc: 6,
                price: 183.03,
                expiry: '2020-12-01',
                purchaes: 20,
                finalPrice: 20.45,
                createdAt: '2020-09-09',
                completedAt: '2020-11-09',
              },
              {
                id: 3,
                epoc: 6,
                price: 183.03,
                expiry: '2020-12-01',
                purchaes: 20,
                finalPrice: 20.45,
                createdAt: '2020-09-09',
                completedAt: '2020-11-09',
              },
              {
                id: 4,
                epoc: 6,
                price: 183.03,
                expiry: '2020-12-01',
                purchaes: 20,
                finalPrice: 20.45,
                createdAt: '2020-09-09',
                completedAt: '2020-11-09',
              },
              {
                id: 5,
                epoc: 6,
                price: 183.03,
                expiry: '2020-12-01',
                purchaes: 20,
                finalPrice: 20.45,
                createdAt: '2020-09-09',
                completedAt: '2020-11-09',
              },
            ]}
          />
        )}
      </Wrapper>
    </>
  )
})
