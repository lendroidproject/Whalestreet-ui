import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import TxModal from 'components/common/TxModal'
import { PageWrapper } from 'components/styles'
import Tabs from './Tabs'
import AuctionList from './AuctionList'
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
  const [now15] = useTicker(15)
  const [active, setActive] = useState('ongoing')
  const [current, setCurrent] = useState(null)
  const { currentEpoch, currentPrice, epochEndTimeFromTimestamp, minY, maxY } = library.methods.AuctionRegistry
  const getCurrent = () => {
    const { getAllowance } = library.methods.$HRIMP
    library.methods.web3
      .getBlock()
      .then((bTimestamp) => {
        Promise.all([
          getAllowance(address),
          currentEpoch(),
          currentPrice().then(library.web3.utils.fromWei),
          epochEndTimeFromTimestamp(bTimestamp),
          minY().then(library.web3.utils.fromWei).then(Number),
          maxY().then(library.web3.utils.fromWei).then(Number),
        ])
          .then(([a$HRIMP, epoch, price, timestamp, minY, maxY]) => {
            dispatch({
              type: 'METAMASK',
              payload: {
                a$HRIMP,
              },
            })
            setCurrent({ epoch, price: Number(price), timestamp, minY, maxY, x: bTimestamp - timestamp })
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

  const pendingTx = approveTx || purchaseTx
  const pendingText = purchaseTx ? 'Purchasing tokens' : approveTx ? 'Unlocking tokens' : ''

  const [purchases, setPurchases] = useState([])
  const myPurchases = purchases.filter((item) => item.purchases[0] === address && item.epoch === current?.epoch)
  const handlePurchases = (purchase) => {
    const { auctionTokenId: id, epoch, account: purchaser, amount: y, timestamp } = purchase
    const amount = Number(library.web3.utils.fromWei(y))
    epochEndTimeFromTimestamp(timestamp)
      .then((bTimestamp) => {
        const previousPurchase = purchases.pop()
        const x = bTimestamp - timestamp
        if (previousPurchase) {
          setPurchases([
            ...purchases,
            {
              ...previousPurchase,
              amount,
              start: amount,
              end: previousPurchase.start,
            },
            {
              id,
              epoch,
              purchases: [purchaser],
              amount,
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
              amount,
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

  useEffect(() => {
    if (library) {
      getCurrent()
    }
  }, [library, now15])

  return (
    <>
      <div className="bg flex-all">
        <img src="/assets/bg_auction.jpg" alt="Auctions" />
      </div>
      <Wrapper className="center">
        <h1>Auctions</h1>
        <p className="intro">
          On this page, deFi Keys (NFTs) can be purchased using the $HRIMP token. Every epoch, the price of the deFi Key 
          is set according to a Dutch Auction curve. If a Key is not purchased in an epoch, the auction rolls over to the 
          next epoch with the same starting price. The rarity of a deFi Key (Common, Rare, or Legendary) is randomly 
          calculated (using Chainlink VRF) at the time of its purchase.
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
        <TxModal show={pendingTx} text={pendingText} color="purple" />
      </Wrapper>
    </>
  )
})
