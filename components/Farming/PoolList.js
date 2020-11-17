import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import Spinner from 'components/common/Spinner'
import Pool from './Pool'
import PoolDetail from './PoolDetail'

import { pools } from './constants'

const Wrapper = styled.section`
  .pools {
    margin: -20px;
    @media all and (max-width: 577px) {
      margin: -10px;
    }
  }
`

export default function PoolList({ farm = '$hrimp' }) {
  const [basePools, setPools] = useState(null)
  const [selectedPool, setPool] = useState(null)

  useEffect(() => {
    if (!basePools || basePools.length === 0 || basePools[0].farm !== farm) {
      const basePools = pools.filter((item) => item.farm.toLowerCase() === farm)
      setPools(basePools)
    }
  }, [farm])

  if (selectedPool) {
    return (
      <Wrapper className="center">
        <h1>Stake, Unstake &amp; Claim </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
        </p>
        <div className="flex-center justify-center">
          <PoolDetail
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
        <h1>FARM $HRIMP</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
        </p>
        <div className="flex-wrap justify-center pools">
          {basePools.map((pool) => (
            <Pool
              {...pool}
              key={pool.pair}
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
}
