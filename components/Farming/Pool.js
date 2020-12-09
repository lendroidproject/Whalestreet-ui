import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getDuration, useTicker } from 'utils/hooks'

export const Wrapper = styled.div`
  width: 307px;
  max-width: 100%;
  border-radius: 12px;
  background-color: var(--color-blue);
  padding: 23px 23px 26px;
  text-align: center;
  margin: 20px;
  color: var(--color-white);
  @media all and (max-width: 577px) {
    padding: 12px 16px 15px;
    margin: 10px;
    width: 100%;
    max-width: 374px;
  }

  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  p {
    line-height: 36px;
    margin-bottom: 13px;
    @media all and (max-width: 577px) {
      margin-bottom: 0;
    }

    &.apy {
      font-size: 20px;
    }
  }

  label.light {
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
  }

  label + p {
    margin-top: 2px;
  }

  .pool-data button {
    width: 223px;
    border-radius: 7px;
    @media all and (max-width: 577px) {
      width: 100px;
      margin-left: 15px;
    }
  }

  .series {
    text-align: right;
    margin-top: 24px;
    width: 100%;
    @media all and (max-width: 577px) {
      margin-top: 12px;
    }

    td:first-child {
      text-align: left;
    }
  }

  @media all and (max-width: 577px) {
    .pool-info,
    .pool-data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      &__detail {
        display: flex;
      }

      h2,
      p {
        font-size: 16px;
        line-height: 24px;
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    .pool-info {
      padding-bottom: 10px;
      border-bottom: 1px solid var(--color-border2);
    }

    .pool-data {
      padding-top: 16px;

      &__detail {
        flex-direction: column;
        text-align: left;
      }

      label.light {
        font-size: 12px;
        line-height: 17px;
        white-space: nowrap;
      }
    }
  }
`

export const PoolIcon = styled.div`
  padding: 14px 20px 6px;
  border-radius: 30.5px;
  color: var(--color-white);
  @media all and (max-width: 577px) {
    padding: 0;
    margin-right: 6px;
  }

  img {
    width: 36px;
    height: 36px;
    margin: 0 3px;
    @media all and (max-width: 577px) {
      width: 22px;
      height: 22px;
    }
  }
`

export default function Pool({ base, pair, coming, onSelect, metamask, library }) {
  const HEART_BEAT_START_TIME = metamask.heartBeatTime
  const EPOCH_PERIOD = metamask.epochPeriod
  const { currentEpoch } = metamask
  const [[epoch, rate], setRewardRate] = useState([0, 0])
  const currentSeries =
    !epoch || epoch === 0
      ? 0
      : epoch <= 84
      ? 1
      : epoch > 84 && epoch <= 336
      ? 2
      : epoch > 336 && epoch <= 588
      ? 3
      : epoch > 588 && epoch <= 840
      ? 4
      : epoch > 840 && epoch <= 1092
      ? 5
      : 0
  const countdown = HEART_BEAT_START_TIME + EPOCH_PERIOD * (84 + 252 * (currentSeries - 1))
  const [now] = useTicker()
  const duration = getDuration(now, countdown * 1000)

  const { rewardRate } = library.methods.LSTETHPool
  useEffect(() => {
    if (currentEpoch && currentEpoch !== epoch) {
      rewardRate(currentEpoch)
        .then((rate) => {
          setRewardRate([currentEpoch, Number(library.web3.utils.fromWei(rate))])
        })
        .catch(console.log)
    }
  }, [currentEpoch])

  const stakePercent = ((metamask.LSTETHPool || 0) / (metamask.sLSTETHPool || 1)) * 100

  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <div className="pool-info">
        <div className="pool-info__detail">
          <PoolIcon className="flex-center justify-center pool-info__icons">
            <img src={`/assets/${base.toLowerCase()}-token.svg`} alt={base} />
            <img src={`/assets/${pair.toLowerCase()}-token.svg`} alt={pair} />
          </PoolIcon>
          <h2>
            {base}/{pair} POOL
          </h2>
        </div>
        <p className="apy">Total amount staked: {metamask.sLSTETHPool}</p>
      </div>
      <div className="pool-data">
        <div className="pool-data__detail">
          <label className="light uppercase">Your stake %</label>
          <p className="reward">{metamask.LSTETHPool > 0 && stakePercent < 0.01 ? '< 0.01' : stakePercent.toFixed(2)}%</p>
        </div>
        {coming ? (
          <button className="uppercase red" disabled>
            Select
          </button>
        ) : (
          <button className="uppercase red" onClick={onSelect}>
            Select
          </button>
        )}
      </div>
      {currentSeries > 0 && (
        <table className="series">
          <tbody>
            <tr>
              <td>Current series:</td>
              <td>{currentSeries}</td>
            </tr>
            <tr>
              <td>Reward rate:</td>
              <td>{rate.toFixed(8)}</td>
            </tr>
            <tr>
              <td>Series ends in:</td>
              <td>{duration}</td>
            </tr>
          </tbody>
        </table>
      )}
    </Wrapper>
  )
}
