import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { PageWrapper as Wrapper, Statics, OurTokens } from 'components/styles'

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

export default connect((state) => state)(function Farming({ metamask, onModule }) {
  return (
    <>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <Wrapper className="center">
        <h1>Welcome to Whale Street.</h1>
        <p className="intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
          <br />
          <br />
          <a className="watch-video">
            <img src="/assets/video.png" alt="Welcome to Whale Street" />
            Watch Video
          </a>
        </p>
        <Statics className="flex-center flex-wrap justify-between">
          <div className="statics__item">
            <label>$hrimp Balance</label>
            <p>{(metamask.$HRIMP || 0).toFixed(2)}</p>
          </div>
          <div className="statics__item">
            <label>$hrimp Price</label>
            <p>-</p>
          </div>
          <div className="statics__item">
            <label>$hrimp Total Supply</label>
            <p>{(metamask.s$HRIMP || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}</p>
          </div>
          <div className="statics__item">
            <label>LST Price</label>
            <p>-</p>
          </div>
        </Statics>
        <RewardTokens className="flex-wrap justify-center">
          <div className="reward-token cursor flex-all relative" onClick={() => onModule('farming')}>
            <img src="/assets/shrimp-farm.png" alt="Farm $hrimp" />
            <label>Farm $hrimp</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon" onClick={() => false && onModule('auctions')}>
            <img src="/assets/gaffe-hoard.png" alt="Gaffe Hoard" />
            <label>Gaffe Hoard</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon">
            <img src="/assets/swapmaster.png" alt="Swap Master" />
            <label>Swap Master</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon" onClick={() => false && onModule('whale-swap')}>
            <img src="/assets/whaleswap.png" alt="Whale Swap" />
            <label>Whale Swap</label>
          </div>
          <div className="reward-token cursor flex-all relative coming-soon">
            <img src="/assets/noon-report.png" alt="Noon Report" />
            <label>Noon Report</label>
          </div>
        </RewardTokens>
        <OurTokens>
          <h2>Our Tokens</h2>
          <div className="buttons flex-center justify-center">
            <button>$hrimp</button>
            <button>LST</button>
            <button>NFT</button>
          </div>
        </OurTokens>
      </Wrapper>
    </>
  )
})
