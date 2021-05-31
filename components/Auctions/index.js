import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { PageWrapper } from 'components/styles'
import Tabs from './Tabs'
import AuctionList, { EPOCH_PERIOD } from './AuctionList'
import AuctionTable from './AuctionTable'
import { useTicker } from 'utils/hooks'

const Wrapper = styled(PageWrapper)`
  .tabs {
    margin-top: 16px;
    margin-bottom: 60px;
    border: 1px solid var(--color-red2);

    li {
      &.active {
        background: var(--color-red2);
      }
    }
  }
`

export default connect((state) => state)(function Auctions({
  metamask: { address, a$HRIMP },
  auctions: library,
  dispatch,
}) {
  const [now] = useTicker()
  const [active, setActive] = useState('ongoing')
  const [current, setCurrent] = useState(null)
  const { currentEpoch, currentPrice, epochEndTimeFromTimestamp } = library.methods.AuctionRegistry
  const getCurrent = () => {
    const { getAllowance } = library.methods.$HRIMP
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
            setCurrent({ epoch, price: Number(price), timestamp })
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
  const myPurchases = purchases.filter((item) => ((item.purchases[0] === address) && (item.epoch === current?.epoch)))
  const handlePurchases = (purchase) => {
    const { auctionTokenId: id, epoch, account: purchaser, amount: y, timestamp } = purchase
    const amount = Number(library.web3.utils.fromWei(y))
    epochEndTimeFromTimestamp(timestamp)
      .then((bTimestamp) => {
        console.log(JSON.parse(JSON.stringify(purchases)))
        const previousPurchase = purchases.pop()
        const x = bTimestamp - timestamp
        if (previousPurchase) {
          setPurchases([
            ...purchases,
            {
              ...previousPurchase,
              start: amount,
              end: previousPurchase.start
            },
            {
              id,
              epoch,
              purchases: [purchaser],
              start: amount,
              end: 1,
              timestamp,
              x,
            },
          ])
        } else {
          setPurchases([
            {
              id,
              epoch,
              purchases: [purchaser],
              start: amount,
              end: 1,
              timestamp,
              x,
            },
          ])
        }
      })
      .catch(console.log)
  }
  const getPurchase = () => {
    if (totalPurchase && totalPurchase > purchases.length) {
      const { purchases: fetchPurchase } = library.methods.AuctionRegistry
      fetchPurchase(totalPurchase - purchases.length - 1)
        .then(handlePurchases)
        .catch(console.log)
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
          On this page, deFi Keys (NFTs) can be purchased using the $HRIMP token.
          Every epoch, the price of the deFi Key is set according to a Dutch Auction curve.
          If an Key is not purchased during the current epoch, it rolls over to the next epoch with a reduced purchase price.
          The rarity of a deFi Key (Common Rare, Legendary) is randomly computed during the time of its purchase.
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
            now={now}
            current={current}
            lastPurchase={purchases[0]}
            getCurrent={getCurrent}
            allowance={a$HRIMP}
            pending={approveTx || purchaseTx}
            onPurchase={handlePurchase}
            purchased={myPurchases.length > 0}
          />
        )}
        {active === 'completed' && <AuctionTable purchases={purchases} current={current} />}
      </Wrapper>
    </>
  )
})
