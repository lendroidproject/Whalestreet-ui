import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { InlineMath } from 'react-katex'

import { getDuration } from 'utils/hooks'
import { uniswapPair } from 'utils/etherscan'
import { getPoolLiquidityUSD, getTokenPriceUSD } from 'utils/uniswap'
import { format } from 'utils/number'
import { addresses, pools, uniV2s } from 'layouts/constants'
import { mediaSize, withMedia } from 'utils/media'
import Spinner from 'components/common/Spinner'

export const Wrapper = styled.div`
  ${withMedia(null, 'width', ['288px', '396px', '504px'])}
  max-width: 100%;
  border-radius: 12px;
  background-color: transparent;
  text-align: center;
  margin: 20px;
  color: var(--color-white);
  ${mediaSize.mobile} {
    padding: 12px 16px 8px;
    margin: 10px;
    width: 100%;
    max-width: 374px;
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 13px;
    ${mediaSize.mobile} {
      margin-bottom: 0;
    }

    &.apy {
      font-weight: normal;
      min-width: 114px;
      border-radius: 5px;
      background-color: #000000;
      padding: 7px 10px;

      display: inline-flex;
      justify-content: center;
      ${withMedia(null, 'font-size', ['16px', '24px', '32px'])}

      .tool-tip {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        margin: 4px 0px 4px 6px;
        ${withMedia(null, 'font-size', ['11px', '17px', '22px', '12px'])}

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
    line-height: 21px;
    ${withMedia(null, 'font-size', ['14px', '21px', '28px', '11px'])}
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
      ${mediaSize.mobile} {
        align-items: flex-start;
      }
    }

    &.top {
      ${mediaSize.mobile} {
        flex-direction: row-reverse;

        .apy {
          margin-left: 15px;
          margin-bottom: 12px;

          span {
            margin: 0;
            margin-left: 10px;
          }
        }
      }
    }
  }

  .pool-data button {
    width: 151px;
    border-radius: 7px;
    margin-bottom: 24px;
    ${mediaSize.mobile} {
      width: 114px;
      margin-left: 15px;
      margin-bottom: 12px;
    }
  }

  .series {
    text-align: right;
    width: 100%;

    line-height: 1.2;
    font-weight: 100;
    ${withMedia(null, 'font-size', ['14px', '20px', '25px', '12px'])}

    border-radius: 4px;
    margin: 0 6px;
    width: calc(100% - 12px);
    padding: 8px;

    td:first-child {
      text-align: left;
    }

    td span {
      font-size: 70%;
      white-space: nowrap;
    }
  }

  .add-liquidity {
    ${withMedia(null, 'font-size', ['14px', '21px', '28px', '11px'])}

    margin-bottom: 0;
    width: 100%;
    margin: 12px;

    a {
      color: var(--color-white);
    }

    img {
      margin-left: 6px;
    }
  }

  ${mediaSize.mobile} {
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
        margin-top: 0;
        margin-bottom: 0;
        ${withMedia(null, 'font-size', ['16px', '24px', '32px', '12px'])}
      }
    }

    .pool-info {
      padding-bottom: 10px;

      ${mediaSize.mobile} {
        flex-direction: column;
      }
    }

    .pool-data {
      &.top {
        padding-top: 16px;
      }

      &__detail {
        flex-direction: column;
        text-align: left;
        margin-bottom: 12px;
      }

      label.light {
        line-height: 17px;
        white-space: nowrap;
        ${withMedia(null, 'font-size', ['12px', '18px', '24px', '10px'])}
      }
    }
  }
`

export const PoolIcon = styled.div`
  padding: 20px 0 10px;
  ${mediaSize.mobile} {
    padding: 0;
    margin-right: 6px;
  }

  img {
    width: 36px;
    height: 36px;
    margin: 0 3px;
    ${mediaSize.mobile} {
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
        : 6
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
        : 3
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
        : 6
  }
}

export const getSeriesEnd = (type, epoch) => {
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
        ? 588
        : epoch > 588 && epoch <= 840
        ? 840
        : epoch > 840 && epoch <= 1092
        ? 1092
        : 0
  }
}

function toSec(number) {
  return parseInt(number / 1000)
}

export default function Pool({
  farm,
  base,
  pair,
  pool,
  uniV2,
  uniPair,
  seriesType,
  coming,
  background,
  color,
  icon,
  rewardBySeries,
  onSelect,
  metamask,
  library,
  now,
}) {
  const poolIndex = pools.findIndex((item) => item === pool)
  const uniIndex = uniV2s.findIndex((item) => item === uniV2)
  const {
    poolEpochs = [],
    poolEpochPeriods = [],
    poolHeartBeatTimes = [],
    poolBalances = [],
    poolSupplies = [],
    uniV2Supplies = [],
  } = metamask
  const currentEpoch = poolEpochs[poolIndex] || 0
  const EPOCH_PERIOD = poolEpochPeriods[poolIndex] || 0
  const HEART_BEAT_START_TIME = poolHeartBeatTimes[poolIndex] || 0

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
    const seconds = toSec(now)
    if (!uniData || seconds % 60 === 0) {
      loadUniData()
    }
  }, [base, now])

  const stakePercent = ((poolBalances[poolIndex] || 0) / (poolSupplies[poolIndex] || 1)) * 100

  const loading = !uniData || !currentSeries

  return (
    <Wrapper
      className={`flex-center flex-column ${background ? `background-${background}` : ''}`}
      key={`${base}${pair}`}
      detail
    >
      {loading ? (
        <Spinner style={{ position: 'relative', minHeight: '50vh' }} />
      ) : (
        <>
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
                APY {duration ? getAPY() : 0}%{' '}
                {duration && (
                  <span
                    className={`tool-tip cursor info-${icon}`}
                    data-tip
                    data-for={`${pool}-apy`}
                    data-iscapture="true"
                  ></span>
                )}
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
                  {duration ? (
                    <>
                      <tr>
                        <td>Current series:</td>
                        <td>{currentSeries}</td>
                      </tr>
                      <tr>
                        <td>
                          Rewards <span>({farm} / second)</span>:
                        </td>
                        <td>{rate.toFixed(8)}</td>
                      </tr>
                      <tr>
                        <td>Series ends in:</td>
                        <td>{duration}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={2} style={{ lineHeight: 1.4 }}>
                        The reward cycle has ended for this pool.
                        <br />
                        <br />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="add-liquidity underline flex-center justify-center">
                <a href={uniswapPair(uniPair)} target="_blank">
                  {base}-{pair} Uniswap Pool
                  <img src="/assets/link-icon.svg" />
                </a>
              </p>
            </>
          )}
          {duration && (
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
          )}
        </>
      )}
    </Wrapper>
  )
}
