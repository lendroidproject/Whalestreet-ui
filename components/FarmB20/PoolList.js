import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import Spinner from 'components/common/Spinner'
import Tabs from 'components/Auctions/Tabs'
import { PoolListWrapper } from '../Farming/PoolList'
import Pool, { getSeriesEnd } from '../Farming/Pool'
import PoolDetail from '../Farming/PoolDetail'

import { pools } from './constants'
import { getDuration, useTicker } from 'utils/hooks'

export default connect((state) => state)(function PoolList(props) {
  const { farm = 'B20', wallet, account, info = {}, poolInfo = {}, farming: library, dispatch, connectWallet } = props

  const [active, setActive] = useState('ongoing')
  const [basePools, setPools] = useState([])
  const [selectedPool, setPool] = useState(null)
  const [now] = useTicker()

  useEffect(() => {
    if (basePools.length === 0 || basePools[0].farm !== farm) {
      const basePools = pools.filter((item) => item.farm === farm)
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
        <p>Here, you can not only stake and unstake your pool tokens, but also claim your B20 rewards</p>
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
        <h1>Farm B.20</h1>
        <p>
          Farm B20s. Stake pool tokens to get B20 rewards from any of the available pools.{' '}
          <a href="https://lucas-gilcanton.medium.com/3cc5e89656fa" target="_blank">
            Here's
          </a>{' '}
          a step-by-step guide to provide liquidity to the B20-ETH Uniswap Pool. Choose wisely. For more information,
          check out{' '}
          <a href="https://b20.whalestreet.xyz" target="_blank">
            https://b20.whalestreet.xyz
          </a>
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
