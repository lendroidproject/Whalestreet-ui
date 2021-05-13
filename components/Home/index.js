import React, { useState, useEffect, memo } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import qs from 'qs'
import BigNumber from 'bignumber.js'

import Countdown from 'react-countdown'

import { getDuration, useTicker } from 'utils/hooks'
import { getTokenPriceUSD } from 'utils/uniswap'
import { format } from 'utils/number'
import { addresses } from 'layouts/constants'
import { PageWrapper as Wrapper, Statics } from 'components/styles'
import Promo from './Promo'

import adminAssets from 'components/Admin/admin-assets'
import { getAssets } from 'utils/api'
import { mediaSize, withMedia } from 'utils/media'

const B20_START = new Date('2021-01-24 01:45:00+000').getTime()
const leadZero = (val) => `00${val}`.substr(-2)

const RewardTokens = styled.div`
  width: 90%;
  margin: -8px auto;
  ${mediaSize.tablet} {
    flex-wrap: wrap;
  }

  .row {
    width: 50%;
    ${mediaSize.mobile} {
      width: 100%;
    }
  }

  .reward-token {
    margin: 8px;
    padding: 14px;

    border: 1px solid #000000;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.3);
    text-decoration: none;

    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }

    p {
      font-style: italic;
      color: var(--color-white);
      margin-left: 12px;
      ${withMedia(null, 'font-size', ['18px', '27px', '36px', '13px'])}
    }

    img {
      width: 49px;
      height: 49px;
      background-color: var(--color-red);
      border-radius: 50%;
      ${mediaSize.mobile} {
      }
    }

    &.image img {
      background: transparent;
    }
  }

  .coming-soon {
    opacity: 0.24;
    cursor: not-allowed;
  }
`

export default connect((state) => state)(function Farming({ metamask, library, onModule }) {
  const [video, setVideo] = useState(false)
  const [[blockTimestamp, epochEndTime], setEpochEndTime] = useState([0, 0])
  const [now] = useTicker()
  const [assets, setAssets] = useState([])
  const [data, setData] = useState(null)
  const duration = getDuration(now, epochEndTime * 1000)

  const { latestBlockTimestamp } = metamask
  const { epochEndTimeFromTimestamp } = library.methods.LST_WETH_UNIV2_$HRIMP_Pool
  const { totalSupply } = library.methods.B20
  const toNumber = library.web3.utils.fromWei

  useEffect(() => {
    if (latestBlockTimestamp && latestBlockTimestamp !== blockTimestamp) {
      epochEndTimeFromTimestamp(latestBlockTimestamp)
        .then((endTime) => {
          if (endTime !== epochEndTime) setEpochEndTime([latestBlockTimestamp, endTime])
        })
        .catch(console.log)
    }
  }, [latestBlockTimestamp])

  useEffect(() => {
    const tokenAssets = metamask.network === 1 ? adminAssets[metamask.network] : adminAssets[4]
    if (tokenAssets && tokenAssets.length) {
      const queryAssets = async function () {
        try {
          const result = await getAssets(
            {
              token_ids: tokenAssets.map(({ tokenId }) => tokenId),
              asset_contract_addresses: tokenAssets.map(({ tokenAddress }) => tokenAddress),
              limit: 50,
              offset: 0,
            },
            {
              paramsSerializer: (params) => {
                return qs.stringify(params, { arrayFormat: 'repeat' })
              },
            }
          )
          if (result?.data?.assets) {
            const assets = result.data.assets.map((asset) => {
              const matching = tokenAssets.find(
                (e) => e.tokenId === asset.token_id && e.tokenAddress === asset?.asset_contract_addresses?.address
              )
              asset.archived = matching ? matching.archived : false
              return asset
            })
            setAssets(assets)
          }
        } catch (err) {
          console.log(err)
        }
      }
      queryAssets()
    }
  }, [metamask.network])

  const loadData = () => {
    Promise.all([getTokenPriceUSD(addresses[1].B20), totalSupply()])
      .then(([b20USDPrice, b20TotalSupply]) => {
        setData({
          b20USDPrice,
          b20TotalSupply: toNumber(b20TotalSupply),
          b20USDTotal: new BigNumber(b20USDPrice).multipliedBy(toNumber(b20TotalSupply)).toString(),
        })
      })
      .catch(console.log)
  }

  useEffect(() => {
    loadData()
  }, [metamask.network])

  const isAdminOwner = false && assets?.[0]?.owner?.address === metamask.address

  return (
    <>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <Wrapper className="center">
        <h1>Yield Farming. NFT Collectibles. Massive Token Swaps.</h1>
        <p className="intro">
          Welcome. WhaleStreet has engineered the bundling and fractionalizing of the $2.7 mn B.20 bundle. You can now
          farm B20 tokens for exciting rewards. Join the B20 discord{' '}
          <a href="https://discord.com/invite/pEbSg4qp3y" target="_blank">
            here
          </a>
          . Learn more about the B.20 project{' '}
          <a href="https://b20.metapurse.fund" target="_blank">
            here
          </a>
          .
          <br />
          <br />
          <a
            href="/"
            className="watch-video"
            onClick={(e) => {
              e.preventDefault()
              setVideo(true)
            }}
          >
            <img src="/assets/video.png" alt="Yield Farming. NFT Collectibles. Massive Token Swaps." />
            Watch Video
          </a>
          <Promo show={video} onHide={() => setVideo(false)} />
        </p>
        {now < B20_START ? (
          <Statics className="b20-sale center limited">
            <span className="small">B20 Capped Sale starts in</span>
            <Countdown
              date={B20_START}
              renderer={({ hours, minutes, seconds, completed }) =>
                !completed ? (
                  <>
                    <span>{leadZero(hours)}</span>:<span>{leadZero(minutes)}</span>:<span>{leadZero(seconds)}</span>
                  </>
                ) : (
                  <span>Loading...</span>
                )
              }
            />
          </Statics>
        ) : (
          <Statics className="flex-center flex-wrap justify-between limited">
            <div className="statics__item">
              <label>TVL</label>
              <p>
                <span>$</span>
                {format(data?.b20USDTotal, 0)}
              </p>
            </div>
            {/* <div className="statics__item">
              <label>Treasury</label>
              <p>---</p>
            </div> */}
            <div className="statics__item">
              <label>Current Epoch</label>
              <p>{(metamask.poolEpochs && metamask.poolEpochs[0]) || '-'}</p>
            </div>
            <div className="statics__item">
              <label>Next epoch in</label>
              <p>{duration || '-'}</p>
            </div>
          </Statics>
        )}
        <RewardTokens className="flex limited margin">
          <div className="row flex-column">
            <div className="reward-token cursor flex-center relative image" onClick={() => onModule('farm-b20')}>
              <img src="/assets/b20-token.svg" alt="Farm B20" />
              <p>Farm B20</p>
            </div>
            <div className="reward-token cursor flex-center relative image" onClick={() => onModule('farming')}>
              <img src="/assets/$hrimp-token.svg" alt="Farm $hrimp" />
              <p>Farm $hrimp</p>
            </div>
            {/* <div className="reward-token cursor flex-center relative image" onClick={() => onModule('farm-lst')}>
              <img src="/assets/lst-token.svg" alt="Farm LST" />
              <p>Farm LST</p>
            </div> */}
          </div>
          <div className="row flex-column">
            <div
              className={`reward-token cursor flex-center relative ${process.env.AUCTION_ENABLED ? '' : 'coming-soon'}`}
              onClick={() => process.env.AUCTION_ENABLED && onModule('auctions')}
            >
              <img src="/assets/gaffe-hoard.png" alt="Gaff NFT" />
              <p>Gaff NFT</p>
            </div>
          </div>
          <div className="row flex-column">
            <div
              className={`reward-token cursor flex-center relative ${isAdminOwner ? '' : 'coming-soon'}`}
              onClick={() => isAdminOwner && onModule('market-admin')}
            >
              <img src="/assets/swapmaster.png" alt="Market Admin" />
              <p>Market Admin</p>
            </div>
          </div>
          <div className="row flex-column">
            {/* <a href="https://b20.whalestreet.xyz" target="_blank" className="reward-token cursor flex-center relative image">
              <img src="/assets/get-b20.svg" alt="Get B20" />
              <p>Get B20</p>
            </a> */}
            <div
              className="reward-token cursor flex-center relative coming-soon"
              onClick={() => false && onModule('whale-swap')}
            >
              <img src="/assets/whaleswap.png" alt="Whale Swap" />
              <p>Whale Swap</p>
            </div>
          </div>
        </RewardTokens>
      </Wrapper>
    </>
  )
})
