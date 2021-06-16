import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Spinner from 'components/common/Spinner'
import Tabs from 'components/Auctions/Tabs'
import Pool, { getSeriesEnd } from './Pool'
import PoolDetail from './PoolDetail'

import { pools } from './constants'
import { mediaSize } from 'utils/media'
import { getDuration, useTicker } from 'utils/hooks'

export const PoolListWrapper = styled.section`
  .tabs {
    border-width: 2px;
    background: var(--color-trans);
    li {
      text-transform: uppercase;
    }
  }
  .pools {
    margin: -20px;
    ${mediaSize.mobile} {
      margin: -10px;
    }
  }
`

export default connect((state) => state)(function PoolList(props) {
  const {
    farm = '$hrimp',
    wallet,
    account,
    info = {},
    poolInfo = {},
    farming: library,
    dispatch,
    connectWallet,
  } = props

  const [active, setActive] = useState('ongoing')
  const [basePools, setPools] = useState([])
  const [selectedPool, setPool] = useState(null)
  const [now] = useTicker()

  useEffect(() => {
    if (basePools.length === 0 || basePools[0].farm !== farm) {
      const basePools = pools.filter((item) => item.farm.toLowerCase() === farm)
      setPools(basePools)
    }
  }, [farm])

  function isActive({ seriesType }) {
    const { poolEpoch: currentEpoch, poolEpochPeriod: EPOCH_PERIOD, poolHeartBeatTime: HEART_BEAT_START_TIME } = info
    const countdown = HEART_BEAT_START_TIME + EPOCH_PERIOD * getSeriesEnd(seriesType, currentEpoch)
    return getDuration(now, countdown * 1000)
  }
  const [ongoing, completed] = basePools.reduce(
    ([ongoing, completed], pool) => {
      if (isActive(pool)) ongoing.push(pool)
      else completed.push(pool)
      return [ongoing, completed]
    },
    [[], []]
  )
  const tabPools = active === 'ongoing' ? ongoing : completed

  useEffect(() => {
    if (ongoing.length + completed.length === 0) return
    if (active === 'ongoing' && ongoing.length === 0) setActive('completed')
    if (active === 'completed' && completed.length === 0) setActive('ongoing')
  }, [active])

  if (selectedPool) {
    return (
      <PoolListWrapper className="center">
        <h1>Stake, Unstake &amp; Claim </h1>
        <p>
          You can stake and un-stake your pool tokens here.
          <br />
          And after a whale swap, redeem them for $hrimp.
        </p>
        <div className="flex-center justify-center">
          <PoolDetail
            account={account}
            library={library}
            info={info}
            poolInfo={poolInfo}
            dispatch={dispatch}
            {...selectedPool}
            detail
            onBack={() => {
              setPool(null)
            }}
            now={now}
          />
        </div>
      </PoolListWrapper>
    )
  } else {
    return basePools.length ? (
      <PoolListWrapper className="center">
        <h1>FARM $HRIMP</h1>
        <p>
          Provide liquidity to the{' '}
          <a href="https://app.uniswap.org/#/add/v2/0x4de2573e27e648607b50e1cfff921a33e4a34405/ETH" target="_blank">
            LST-ETH uniswap pool
          </a>{' '}
          to get pool tokens.
          <br />
          By staking pool tokens, you can mine $hrimp.
        </p>
        <Tabs
          tab={active}
          onTab={setActive}
          options={[
            {
              value: 'ongoing',
              label: 'Active',
              // label: 'Currently active pools',
              disabled: ongoing.length === 0,
            },
            {
              value: 'completed',
              label: 'Archived',
              // label: 'Archived pools',
              disabled: completed.length === 0,
            },
          ]}
        />
        <div className="flex-wrap justify-center pools">
          {tabPools.map((pool) => (
            <Pool
              account={account}
              library={library}
              info={info}
              poolInfo={poolInfo}
              {...pool}
              key={pool.pool}
              onSelect={() => {
                if (account) setPool(pool)
                else
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
              }}
              now={now}
            />
          ))}
        </div>
      </PoolListWrapper>
    ) : (
      <Spinner />
    )
  }
})
