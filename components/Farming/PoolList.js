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

export default connect((state) => state)(function PoolList({ farm = '$hrimp', metamask, library }) {
  const [active, setActive] = useState('ongoing')
  const [basePools, setPools] = useState(null)
  const [selectedPool, setPool] = useState(null)
  const [now] = useTicker()

  useEffect(() => {
    if (!basePools || basePools.length === 0 || basePools[0].farm !== farm) {
      const basePools = pools.filter((item) => item.farm.toLowerCase() === farm)
      setPools(basePools)
    }
  }, [farm])

  const { poolEpochs = [], poolEpochPeriods = [], poolHeartBeatTimes = [] } = metamask
  const tabPools = (basePools || []).filter(({ pool, seriesType }) => {
    const poolIndex = pools.findIndex((item) => item.pool === pool)
    const currentEpoch = poolEpochs[poolIndex] || 0
    const EPOCH_PERIOD = poolEpochPeriods[poolIndex] || 0
    const HEART_BEAT_START_TIME = poolHeartBeatTimes[poolIndex] || 0
    const countdown = HEART_BEAT_START_TIME + EPOCH_PERIOD * getSeriesEnd(seriesType, currentEpoch)
    return (active === 'ongoing') ^ !getDuration(now, countdown * 1000)
  })

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
            metamask={metamask}
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
    return basePools ? (
      <PoolListWrapper className="center">
        <h1>FARM $HRIMP</h1>
        <p>
          Provide liquidity to the{' '}
          <a href="https://app.uniswap.org/#/add/0x4de2573e27e648607b50e1cfff921a33e4a34405/ETH" target="_blank">
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
            },
            {
              value: 'completed',
              label: 'Archived',
              // label: 'Archived pools',
            },
          ]}
        />
        <div className="flex-wrap justify-center pools">
          {tabPools.map((pool) => (
            <Pool
              metamask={metamask}
              library={library}
              {...pool}
              key={pool.pair}
              onSelect={() => {
                setPool(pool)
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
