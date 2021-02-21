import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Spinner from 'components/common/Spinner'
import Pool from '../Farming/Pool'
import PoolDetail from '../Farming/PoolDetail'

import { pools } from './constants'
import { mediaSize } from 'utils/media'

const Wrapper = styled.section`
  .pools {
    margin: -20px;
    ${mediaSize.mobile} {
      margin: -10px;
    }
  }
`

export default connect((state) => state)(function PoolList({ farm = 'B20', metamask, library }) {
  const [basePools, setPools] = useState(null)
  const [selectedPool, setPool] = useState(null)

  useEffect(() => {
    if (!basePools || basePools.length === 0 || basePools[0].farm !== farm) {
      const basePools = pools.filter((item) => item.farm === farm)
      setPools(basePools)
    }
  }, [farm])

  if (selectedPool) {
    return (
      <Wrapper className="center">
        <h1>Stake, Unstake &amp; Claim </h1>
        <p>Here, you can not only stake and unstake your pool tokens, but also claim your B20 rewards</p>
        <div className="flex-center justify-center">
          <PoolDetail
            metamask={metamask}
            {...selectedPool}
            detail
            onBack={() => {
              setPool(null)
            }}
          />
        </div>
      </Wrapper>
    )
  } else {
    return basePools ? (
      <Wrapper className="center">
        <h1>Farm B.20</h1>
        <p>
          Farm B20s. Stake pool tokens to get B20 rewards from any of the available pools.{' '}
          <a href="https://lucas-gilcanton.medium.com/3cc5e89656fa" target="_blank">
            Here's
          </a>{' '}
          a step-by-step guide to provide liquidity to the B20-ETH Uniswap Pool. Choose wisely. For more information, check out{' '}
          <a href="https://b20.whalestreet.xyz" target="_blank">
            https://b20.whalestreet.xyz
          </a>
        </p>
        <div className="flex-wrap justify-center pools">
          {basePools.map((pool) => (
            <Pool
              metamask={metamask}
              library={library}
              {...pool}
              key={`${pool.base}${pool.pair}`}
              onSelect={() => {
                setPool(pool)
              }}
            />
          ))}
        </div>
      </Wrapper>
    ) : (
      <Spinner />
    )
  }
})
