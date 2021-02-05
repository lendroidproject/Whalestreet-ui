import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { InlineMath } from 'react-katex'

import { getDuration, useTicker } from 'utils/hooks'
import { uniswapLiquidity } from 'utils/etherscan'
import { getPoolLiquidityUSD, getTokenPriceUSD } from 'utils/uniswap'
import { format } from 'utils/number'
import { addresses, pools, uniV2s } from 'layouts/constants'

export const Wrapper = styled.div`
  width: 288px;
  max-width: 100%;
  border-radius: 12px;
  background-color: transparent;
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
    margin-bottom: 10px;
  }

  p {
    line-height: 36px;
    margin-bottom: 13px;
    @media all and (max-width: 577px) {
      margin-bottom: 0;
    }

    &.apy {
      font-size: 16px;
      line-height: 24px;
      font-weight: normal;
      min-width: 114px;
      border-radius: 5px;
      background-color: #000000;
      padding: 7px 10px;

      display: inline-flex;
      justify-content: center;

      .tool-tip {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 11px;
        line-height: 16px;
        margin: 4px 0px 4px 6px;

        background-image: url(/assets/info-icon.svg);
        &.info-pink:hover {
          background-image: url(/assets/info-pink.svg);
        }
        &.info-green:hover {
          background-image: url(/assets/info-green.svg);
        }
        &.info-red:hover {
          background-image: url(/assets/info-red.svg);
        }
      }
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

  .pool-data {
    width: 100%;
    padding: 0 15px;

    &__detail p {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }
    &__detail {
      @media all and (max-width: 577px) {
        align-items: flex-start;
      }
    }

    &.top {
      @media all and (max-width: 577px) {
        flex-direction: row-reverse;

        .apy {
          min-width: 100px;
          margin-left: 15px;
        }
      }
    }
  }

  .pool-data button {
    width: 151px;
    border-radius: 7px;
    margin-bottom: 24px;
    @media all and (max-width: 577px) {
      width: 100px;
      margin-left: 15px;
      margin-bottom: 12px;
    }
  }

  .series {
    text-align: right;
    width: 100%;

    font-size: 14px;
    line-height: 16px;
    font-weight: 100;

    border-radius: 4px;
    margin: 0 6px;
    width: calc(100% - 12px);
    padding: 8px;

    td:first-child {
      text-align: left;
    }
  }

  .add-liquidity {
    font-size: 14px;
    line-height: 18px;

    margin-bottom: 0;
    width: 100%;
    margin: 12px;

    img {
      margin-left: 6px;
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

      @media all and (max-width: 577px) {
        flex-direction: column;
      }
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
  padding: 20px 0 10px;
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

const getSeries = (type, epoch) => {
  switch (type) {
    case 1:
      return !epoch || epoch === 0
        ? 0
        : epoch <= 161
        ? 0
        : epoch > 161 && epoch <= 254
        ? 1
        : epoch > 254 && epoch <= 347
        ? 2
        : epoch > 347 && epoch <= 437
        ? 3
        : epoch > 437 && epoch <= 530
        ? 4
        : epoch > 530 && epoch <= 620
        ? 5
        : epoch > 620 && epoch <= 713
        ? 6
        : 0
    case 2:
    case 3:
      return !epoch || epoch === 0
        ? 0
        : epoch <= 161
        ? 0
        : epoch > 161 && epoch <= 254
        ? 1
        : epoch > 254 && epoch <= 347
        ? 2
        : epoch > 347 && epoch <= 437
        ? 3
        : 0
    default:
      return !epoch || epoch === 0
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
        : epoch > 1092 && epoch <= 3360
        ? 6
        : 0
  }
}

const getSeriesEnd = (type, epoch) => {
  switch (type) {
    case 1:
      return !epoch || epoch === 0
        ? 0
        : epoch <= 161
        ? 161
        : epoch > 161 && epoch <= 254
        ? 254
        : epoch > 254 && epoch <= 347
        ? 347
        : epoch > 347 && epoch <= 437
        ? 437
        : epoch > 437 && epoch <= 530
        ? 530
        : epoch > 530 && epoch <= 620
        ? 620
        : epoch > 620 && epoch <= 713
        ? 713
        : 0
    case 2:
    case 3:
      return !epoch || epoch === 0
        ? 0
        : epoch <= 161
        ? 161
        : epoch > 161 && epoch <= 254
        ? 254
        : epoch > 254 && epoch <= 347
        ? 347
        : epoch > 347 && epoch <= 437
        ? 437
        : 0
    default:
      return !epoch || epoch === 0
        ? 0
        : epoch <= 84
        ? 84
        : epoch > 84 && epoch <= 336
        ? 336
        : epoch > 336 && epoch <= 588
        ? 556
        : epoch > 588 && epoch <= 840
        ? 840
        : epoch > 840 && epoch <= 1092
        ? 1092
        : 0
  }
}

export default function Pool({
  farm,
  base,
  pair,
  pool,
  uniV2,
  seriesType,
  coming,
  background,
  color,
  icon,
  rewardBySeries,
  onSelect,
  metamask,
  library,
}) {
  const poolIndex = pools.findIndex((item) => item === pool)
  const uniIndex = uniV2s.findIndex((item) => item === uniV2)
  const {
    poolEpochs = [],
    poolEpochPeriods = [],
    poolHearBeatTimes = [],
    poolBalances = [],
    poolSupplies = [],
    uniV2Supplies = [],
  } = metamask
  const currentEpoch = poolEpochs[poolIndex] || 0
  const EPOCH_PERIOD = poolEpochPeriods[poolIndex] || 0
  const HEART_BEAT_START_TIME = poolHearBeatTimes[poolIndex] || 0

  const [now] = useTicker(60)
  const [[epoch, rate], setRewardRate] = useState([0, 0])
  const [uniData, setUniData] = useState(null)

  const currentSeries = getSeries(seriesType, epoch)
  const countdown = HEART_BEAT_START_TIME + EPOCH_PERIOD * getSeriesEnd(seriesType, epoch)
  const duration = getDuration(now, countdown * 1000)

  const getAPY = () => {
    if (!uniData || !currentSeries || !rewardBySeries) return '-'
    const [seriesReward, epochCount] = rewardBySeries[currentSeries]
    const { tokenPriceUSD, liquidityUSD } = uniData
    const seriesRewardUSD = tokenPriceUSD * seriesReward
    const liquidityVolumn = (liquidityUSD / uniV2Supplies[uniIndex]) * poolSupplies[poolIndex]
    return (((seriesRewardUSD / (epochCount / 3)) * 365 * 100) / liquidityVolumn).toFixed(0)
  }

  const getAPYInfo = () => {
    if (!uniData || !currentSeries || !rewardBySeries) return '-'
    const [seriesReward, epochCount] = rewardBySeries[currentSeries]
    const { tokenPriceUSD, liquidityUSD } = uniData
    const seriesRewardUSD = tokenPriceUSD * seriesReward
    const liquidityVolumn = (liquidityUSD / uniV2Supplies[uniIndex]) * poolSupplies[poolIndex]
    return (
      <table className="text-left">
        <tbody>
          <tr>
            <td>{farm} Price:</td>
            <td>${format(tokenPriceUSD, 4)}</td>
          </tr>
          <tr>
            <td>Daily reward:</td>
            <td>${format(seriesRewardUSD / (epochCount / 3), 2)}</td>
          </tr>
          <tr>
            <td colSpan={2}>
              <InlineMath
                math={`\\large APY = \\Large{\\frac {${format(
                  seriesRewardUSD / (epochCount / 3),
                  2
                )} \\;\\times\\; 365} {${format(liquidityVolumn, 2)}}} \\large{\\times\\; 100}`}
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  const { rewardRate } = library.methods[pool]
  useEffect(() => {
    if (currentEpoch && currentEpoch !== epoch) {
      rewardRate(currentEpoch)
        .then((rate) => {
          setRewardRate([currentEpoch, Number(library.web3.utils.fromWei(rate))])
        })
        .catch(console.log)
    }
  }, [currentEpoch])

  const loadUniData = () => {
    const poolAddress = addresses[1][`${base}_WETH_UNIV2`]
    const tokenAddress = addresses[1][farm]

    Promise.all([getTokenPriceUSD(tokenAddress), getPoolLiquidityUSD(poolAddress)])
      .then(([tokenPriceUSD, liquidityUSD]) => {
        setUniData({
          tokenPriceUSD,
          liquidityUSD,
        })
      })
      .catch(console.log)
  }

  useEffect(() => {
    loadUniData()
  }, [base, now])

  const stakePercent = ((poolBalances[poolIndex] || 0) / (poolSupplies[poolIndex] || 1)) * 100

  return (
    <Wrapper
      className={`flex-center flex-column ${background ? `background-${background}` : ''}`}
      key={`${base}${pair}`}
      detail
    >
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
      </div>
      <div className="pool-data top">
        {rewardBySeries && (
          <p className="apy center">
            APY {getAPY()}%{' '}
            <span
              className={`tool-tip cursor info-${icon}`}
              data-tip
              data-for={`${pool}-apy`}
              data-iscapture="true"
            ></span>
          </p>
        )}
        <div className="pool-data__detail flex-center flex-column full">
          <label className="light">Total amount staked:</label>
          <p>
            $
            {uniData && currentSeries
              ? format((poolSupplies[poolIndex] || 0) * (uniData.liquidityUSD / uniV2Supplies[uniIndex]), 2)
              : '-'}
          </p>
        </div>
      </div>
      <div className="pool-data">
        <div className="pool-data__detail flex-center flex-column">
          <label className="light uppercase">Your stake</label>
          <p className="reward">
            {poolBalances[poolIndex] > 0 && stakePercent < 0.01 ? '< 0.01' : stakePercent.toFixed(2)}%
          </p>
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
        <>
          <table className="series background-opacity-05">
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
          <p className="add-liquidity underline flex-center justify-center">
            {base}-{pair} Uniswap Pool
            <a href={uniswapLiquidity(library.addresses[base])} target="_blank">
              <img src="/assets/link-icon.svg" />
            </a>
          </p>
        </>
      )}
      <ReactTooltip
        id={`${pool}-apy`}
        effect="solid"
        multiline
        border
        borderColor={color}
        backgroundColor="rgba(0,0,0,0.94)"
      >
        {getAPYInfo()}
      </ReactTooltip>
    </Wrapper>
  )
}
