import React, { useState, useEffect } from 'react'
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

export default connect((state) => state)(function Auctions({
  metamask: { address, a$HRIMP },
  auctions: library,
  dispatch,
}) {
  const [active, setActive] = useState('ongoing')
  const [current, setCurrent] = useState(null)
  const getCurrent = () => {
    const { getAllowance } = library.methods.$HRIMP
    const { currentEpoch, currentPrice, epochEndTimeFromTimestamp } = library.methods.AuctionRegistry
    library.methods.web3
      .getBlock()
      .then((timestamp) => {
        Promise.all([
          getAllowance(address),
          currentEpoch(),
          currentPrice().then(library.web3.utils.fromWei),
          epochEndTimeFromTimestamp(timestamp),
        ])
          .then(([a$HRIMP, epoch, price, timestamp]) => {
            dispatch({
              type: 'METAMASK',
              payload: {
                a$HRIMP,
              },
            })
            setCurrent({ epoch, price, timestamp })
          })
          .catch(console.log)
      })
      .catch(console.log)
  }
  const [approveTx, setApproveTx] = useState(null)
  const handleUnlock = () => {
    const { approve } = library.methods.$HRIMP
    approve(library.addresses.AuctionRegistry, library.web3.utils.toWei((10 ** 8).toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setApproveTx(hash)
      })
      .on('receipt', function (receipt) {
        dispatch({
          type: 'METAMASK',
          payload: {
            a$HRIMP: Number(library.web3.utils.fromWei(receipt.events.Approval.returnValues.value)),
          },
        })
        setApproveTx(null)
      })
      .on('error', (err) => {
        setApproveTx(null)
      })
  }
  const [totalPurchase, setTotalPurchase] = useState(0)
  const getTotalPurchase = () => {
    const { totalPurchases } = library.methods.AuctionRegistry
    totalPurchases().then(Number).then(setTotalPurchase).catch(console.log)
  }
  const [purchaseTx, setPurchaseTx] = useState(null)
  const handlePurchase = () => {
    if (a$HRIMP > 0) {
      const { purchase } = library.methods.AuctionRegistry
      purchase({ from: address })
        .send()
        .on('transactionHash', function (hash) {
          setPurchaseTx(hash)
        })
        .on('receipt', function (receipt) {
          setPurchaseTx(null)
          getTotalPurchase()
        })
        .on('error', (err) => {
          setPurchaseTx(null)
        })
    } else {
      handleUnlock()
    }
  }
  const [purchases, setPurchases] = useState([])
  const handlePurchases = (purchase) => {
    const { auctionTokenId: id, epoch, purchaser, y: amount, timestamp } = purchase
    console.log(purchase, {
      id,
      epoch,
      purchases: [purchaser],
      amount: amount,
      timestamp,
    })
    setPurchases([
      {
        id,
        epoch,
        purchases: [purchaser],
        amount: Number(library.web3.utils.fromWei(amount)),
        timestamp,
      },
      ...purchases,
    ])
  }
  const getPurchase = () => {
    if (totalPurchase && totalPurchase > purchases.length) {
      const { purchases: fetchPurchase } = library.methods.AuctionRegistry
      fetchPurchase(purchases.length).then(handlePurchases).catch(console.log)
    }
  }
  useEffect(() => {
    getPurchase()
  }, [totalPurchase, purchases])

  useEffect(() => {
    if (library) {
      getCurrent()
      getTotalPurchase()
    }
  }, [library])

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
            current={current}
            getCurrent={getCurrent}
            allowance={a$HRIMP}
            pending={approveTx || purchaseTx}
            onPurchase={handlePurchase}
          />
        )}
        {active === 'completed' && <AuctionTable purchases={purchases} />}
      </Wrapper>
    </>
  )
})
