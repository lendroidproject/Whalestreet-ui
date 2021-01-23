import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import qs from 'qs'

import Countdown from 'react-countdown'

import { tokenLink } from 'utils/etherscan'
import { getDuration, useTicker } from 'utils/hooks'
import { PageWrapper as Wrapper, Statics, OurTokens } from 'components/styles'
import Promo from './Promo'

import adminAssets from 'components/Admin/admin-assets'
import { getAssets } from 'utils/api'

const B20_START = new Date('2021-01-24 00:30:00+000').getTime()
const leadZero = (val) => `00${val}`.substr(-2)

const RewardTokens = styled.div`
  margin: -12px;
  @media all and (max-width: 577px) {
    margin: -12px -20px;
  }

  .reward-token {
    height: 181px;
    width: 181px;
    background-color: var(--color-red);
    border-radius: 50%;
    margin: 12px 12px 30px;
    box-shadow: var(--box-shadow);

    @media all and (max-width: 577px) {
      height: 101px;
      width: 101px;
    }

    label {
      font-style: italic;
      color: var(--color-white);
      position: absolute;
      bottom: -30px;

      @media all and (max-width: 577px) {
        bottom: -27px;
        font-size: 14px;
        line-height: 21px;
      }
    }

    img {
      max-height: 100%;
      @media all and (max-width: 577px) {
        max-height: 65px;
      }
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
  const duration = getDuration(now, epochEndTime * 1000)

  const { latestBlockTimestamp } = metamask
  const { epochEndTimeFromTimestamp } = library.methods.LSTETHPool
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
          What the Beep! A $2.7 mn bundle - with Beeple's iconic 1/1 pieces, sprawling museums on prime lands across the
          metaverse, and an original soundscape by 3LAU - now tokenised as B20 tokens. Now available for purchase
          exclusively on WhaleStreet. Join the WhaleStreet community {' '}
          <a href="https://discord.com/invite/pEbSg4qp3y" target="_blank">
            discord
          </a>{' '}
          today.
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
          <Statics className="b20-sale center">
            <span className="small">B20 Sale starts in</span>
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
          <Statics className="flex-center flex-wrap justify-between">
            <div className="statics__item">
              <label>$hrimp Balance</label>
              <p>{(metamask.$HRIMP || 0).toFixed(2)}</p>
            </div>
            <div className="statics__item">
              <label>$hrimp Current Supply</label>
              <p>{(metamask.s$HRIMP || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</p>
            </div>
            <div className="statics__item">
              <label>Current Epoch</label>
              <p>{metamask.currentEpoch || '-'}</p>
            </div>
            <div className="statics__item">
              <label>Next epoch in</label>
              <p>{duration || '-'}</p>
            </div>
          </Statics>
        )}
        <RewardTokens className="flex-wrap justify-center">
          <div className="reward-token cursor flex-all relative" onClick={() => onModule('farming')}>
            <img src="/assets/shrimp-farm.png" alt="Farm $hrimp" />
            <label>Farm $hrimp</label>
          </div>
          {now < B20_START ? (
            <div className="reward-token cursor flex-all relative coming-soon" onClick={() => false}>
              <img src="/assets/get-b20.png" alt="Get B20" />
              <label>Get B20</label>
            </div>
          ) : (
            <a className="reward-token cursor flex-all relative" href={process.env.B20_LINK} target="_blank">
              <img src="/assets/get-b20.png" alt="Get B20" />
              <label>Get B20</label>
            </a>
          )}
          <div
            className="reward-token cursor flex-all relative coming-soon"
            onClick={() => false && onModule('auctions')}
          >
            <img src="/assets/gaffe-hoard.png" alt="Gaff NFT" />
            <label>Gaff NFT</label>
          </div>
          <div
            className={`reward-token cursor flex-all relative ${isAdminOwner ? '' : 'coming-soon'}`}
            onClick={() => isAdminOwner && onModule('market-admin')}
          >
            <img src="/assets/swapmaster.png" alt="Market Admin" />
            <label>Market Admin</label>
          </div>
          <div
            className="reward-token cursor flex-all relative coming-soon"
            onClick={() => false && onModule('whale-swap')}
          >
            <img src="/assets/whaleswap.png" alt="Whale Swap" />
            <label>Whale Swap</label>
          </div>
          {/* <div className="reward-token cursor flex-all relative coming-soon">
            <img src="/assets/noon-report.png" alt="Noon Report" />
            <label>Noon Report</label>
          </div> */}
        </RewardTokens>
        <OurTokens>
          <h2>Tokens</h2>
          <div className="buttons flex-center justify-center">
            <a href={tokenLink(library.addresses.$HRIMP, metamask.network)} target="_blank">
              <button>$hrimp</button>
            </a>
            <a href={tokenLink(library.addresses.LST, metamask.network)} target="_blank">
              <button>LST</button>
            </a>
            <a
              href={tokenLink(library.addresses.LST, metamask.network)}
              target="_blank"
              onClick={(e) => e.preventDefault()}
            >
              <button disabled>NFT</button>
            </a>
          </div>
        </OurTokens>
      </Wrapper>
    </>
  )
})
