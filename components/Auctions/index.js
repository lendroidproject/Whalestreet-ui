import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import qs from 'qs'

import TxModal from 'components/common/TxModal'
import { PageWrapper } from 'components/styles'
import Tabs from './Tabs'
import AuctionList from './AuctionList'
import AuctionTable from './AuctionTable'
import { useTicker } from 'utils/hooks'
import { getAssets } from 'utils/api'
import { usePagination } from 'utils/pagination'

const Wrapper = styled(PageWrapper)`
  .tabs {
    margin-top: 16px;
    margin-bottom: 22px;
    border: 1px solid var(--color-red2);

    li {
      &.active {
        background: var(--color-red2);
      }
    }
  }
  a {
    color: #3d39c9;
  }
`

export default connect((state) => state)(function Auctions({
  account,
  wallet,
  auctionInfo: { a$HRIMP } = {},
  auctions: library,
  dispatch,
  connectWallet,
}) {
  const address = account?.address
  const [now] = useTicker()
  const [active, setActive] = useState('ongoing')
  const [current, setCurrent] = useState(null)
  
  const { currentEpoch, currentPrice, epochEndTimeFromTimestamp, minY, maxY } = library.methods.AuctionRegistry
  const getCurrent = () => {
    const { getAllowance } = library.methods.$HRIMP
    library.methods.web3
      .getBlock()
      .then((bTimestamp) => {
        Promise.all([
          address ? getAllowance(address) : Promise.resolve('0'),
          currentEpoch(),
          currentPrice().then(library.web3.utils.fromWei),
          epochEndTimeFromTimestamp(bTimestamp),
          minY().then(library.web3.utils.fromWei).then(Number),
          maxY().then(library.web3.utils.fromWei).then(Number),
        ])
          .then(([a$HRIMP, epoch, price, timestamp, minY, maxY]) => {
            dispatch({
              type: 'AUCTION_INFO',
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
    approve(library.netAddresses.AuctionRegistry, library.web3.utils.toWei((10 ** 8).toString()), { from: address })
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
  const [lastPurchase, setLastPurchase] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalPurchase, setTotalPurchase] = useState(0)
  const getTotalPurchase = () => {
    const { totalPurchases } = library.methods.AuctionRegistry
    totalPurchases().then(Number).then(setTotalPurchase).catch(console.log)
  }
  const getPurchaseById = async (id) => {
    const { purchases: fetchPurchase } = library.methods.AuctionRegistry
    const purchase = await fetchPurchase(id)
    if (purchase) {
      const assets = await getAssets(
        {
          token_ids: [purchase.auctionTokenId],
          asset_contract_addresses: [purchase.auctionTokenAddress],
          limit: 1,
          offset: 0,
        },
        {
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          },
        }
      ).then((result) => result?.data?.assets || [])
      const { auctionTokenId, auctionTokenAddress, epoch, account, amount, timestamp, feePercentage } = purchase
      return {
        id: auctionTokenId,
        tokenAddr: auctionTokenAddress,
        epoch,
        purchases: [account],
        amount: Number(library.web3.utils.fromWei(amount)),
        start: Number(library.web3.utils.fromWei(amount)),
        end: 1,
        timestamp,
        feePercentage,
        // x,
        asset: assets[0],
      }
    }
  }
  useEffect(() => {
    const getLastPurchase = async () => {
      if (totalPurchase > 0) {
        const lastPurchase = await getPurchaseById(totalPurchase - 1)
        setLastPurchase(lastPurchase)
      }
    }
    getLastPurchase()
  }, [totalPurchase])
  
  const [purchaseTx, setPurchaseTx] = useState(null)
  const handlePurchase = () => {
    if (!account) {
      connectWallet()
        .then((provider) => {
          if (provider) {
            wallet.connect(provider)
          }
        })
        .catch((err) => {
          // tslint:disable-next-line: no-console
          console.log('connectWallet', err)
        })
    } else {
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
  }

  const pendingTx = approveTx || purchaseTx
  const pendingText = purchaseTx ? 'Purchasing tokens' : approveTx ? 'Unlocking tokens' : ''
  const [purchases, setPurchases] = useState([])
  
  const myPurchases = purchases.filter((item) => item.purchases[0] === address && item.epoch === current?.epoch)
  const pagination = usePagination({ totalItems: totalPurchase, initialPageSize: 6, initialPage: 0 })
  const getPurchasesByPage = async (pagination) => {
    const { totalItems, startIndex, endIndex } = pagination
    if (totalItems) {
      setLoading(true)
      const { purchases: fetchPurchase } = library.methods.AuctionRegistry
      const ids = Array(endIndex - startIndex + 1)
        .fill()
        .map((_, idx) => totalItems - 1 - startIndex - idx)
      const purchases = await Promise.all(ids.map((id) => fetchPurchase(id)))
      const assets = await getAssets(
        {
          token_ids: purchases.map(({ auctionTokenId }) => auctionTokenId),
          asset_contract_addresses: purchases.map(({ auctionTokenAddress }) => auctionTokenAddress),
          limit: 50,
          offset: 0,
        },
        {
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          },
        }
      ).then((result) => result?.data?.assets || [])
      setPurchases(
        purchases.map((purchase) => {
          const { auctionTokenId, auctionTokenAddress, epoch, account, amount, timestamp, feePercentage } = purchase
          const asset = assets.find((a) => a.token_id === purchase.auctionTokenId)
          return {
            id: auctionTokenId,
            tokenAddr: auctionTokenAddress,
            epoch,
            purchases: [account],
            amount: Number(library.web3.utils.fromWei(amount)),
            start: Number(library.web3.utils.fromWei(amount)),
            end: 1,
            timestamp,
            feePercentage,
            // x,
            asset,
          }
        })
      )
      setLoading(false)
    }
  }
  useEffect(() => {
    getPurchasesByPage(pagination)
  }, [pagination])

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
          On this page, deFi Keys (NFTs) can be purchased using the $HRIMP token. Every epoch, the price of the deFi Key
          is set according to a Dutch Auction curve. If a Key is not purchased in an epoch, the auction rolls over to
          the next epoch with the same starting price. The rarity of a deFi Key (Common, Rare, or Legendary) is randomly
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
            account={account}
            now={now}
            current={current}
            lastPurchase={lastPurchase}
            getCurrent={getCurrent}
            allowance={a$HRIMP}
            pending={approveTx || purchaseTx}
            onPurchase={handlePurchase}
            purchased={myPurchases.length > 0}
          />
        )}
        {active === 'completed' && (
          <AuctionTable current={current} purchases={purchases} pagination={pagination} loading={loading} />
        )}
        <TxModal show={pendingTx} text={pendingText} color="purple" />
      </Wrapper>
    </>
  )
})
