import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Spinner from 'components/common/Spinner'
import Pool from '../Farming/Pool'
import PoolDetail from '../Farming/PoolDetail'

import { pools } from './constants'

const Wrapper = styled.section`
  .pools {
    margin: -20px;
    @media all and (max-width: 577px) {
      margin: -10px;
    }
  }
`

export default connect((state) => state)(function PoolList({ farm = 'LST', metamask, library }) {
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
        <p>
          You can stake and un-stake your pool tokens here.
          <br />
          And after a whale swap, redeem them for LST.
        </p>
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
        <h1>Farm LST</h1>
        <p>
          Provide liquidity to the{' '}
          <a href="https://app.uniswap.org/#/add/0xc4De189Abf94c57f396bD4c52ab13b954FebEfD8/ETH" target="_blank">
            B20-ETH uniswap pool
          </a>{' '}
          to get pool tokens.
          <br />
          By staking pool tokens, you can mine LST.
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
