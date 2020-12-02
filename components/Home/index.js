import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { tokenLink } from 'utils/etherscan'
import { getDuration, useTicker } from 'utils/hooks'
import { PageWrapper as Wrapper, Statics, OurTokens } from 'components/styles'
import Promo from './Promo'

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
          WhaleStreet is a decentralized whale swap protocol. Become a liquidity provider and earn $hrimp. Buy a Gaff
          NFT with $hrimp, become a Swap Master and earn fees from every Whale Swap. Make massive, antifragile token
          swaps. Join the WhaleStreet community discord today.
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
        <Statics className="flex-center flex-wrap justify-between">
          <div className="statics__item">
            <label>$hrimp Balance</label>
            <p>{(metamask.$HRIMP || 0).toFixed(2)}</p>
          </div>
          <div className="statics__item">
            <label>$hrimp Total Supply</label>
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
        <RewardTokens className="flex-wrap justify-center">
          <div className="reward-token cursor flex-all relative" onClick={() => onModule('farming')}>
            <img src="/assets/shrimp-farm.png" alt="Farm $hrimp" />
            <label>Farm $hrimp</label>
          </div>
          <div
            className="reward-token cursor flex-all relative coming-soon"
            onClick={() => false && onModule('auctions')}
          >
            <img src="/assets/gaffe-hoard.png" alt="Gaff NFT" />
            <label>Gaff NFT</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon">
            <img src="/assets/swapmaster.png" alt="Swap Master" />
            <label>Swap Master</label>
          </div>
          <div
            className="reward-token cursor flex-all relative coming-soon"
            onClick={() => false && onModule('whale-swap')}
          >
            <img src="/assets/whaleswap.png" alt="Whale Swap" />
            <label>Whale Swap</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon">
            <img src="/assets/noon-report.png" alt="Noon Report" />
            <label>Noon Report</label>
          </div>
        </RewardTokens>
        <OurTokens>
          <h2>Tokens</h2>
          <div className="buttons flex-center justify-center">
            <a href={tokenLink(library.addresses.$HRIMP)} target="_blank">
              <button>$hrimp</button>
            </a>
            <a href={tokenLink(library.addresses.LST)} target="_blank">
              <button>LST</button>
            </a>
            <button disabled>NFT</button>
          </div>
        </OurTokens>
      </Wrapper>
    </>
  )
})
