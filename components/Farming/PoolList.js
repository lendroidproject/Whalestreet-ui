import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Spinner from 'components/common/Spinner'
import Pool from './Pool'
import PoolDetail from './PoolDetail'

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

export default connect((state) => state)(function PoolList({ farm = '$hrimp', metamask, library }) {
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
          />
        </div>
      </Wrapper>
    )
  } else {
    return basePools ? (
      <Wrapper className="center">
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
        <div className="flex-wrap justify-center pools">
          {basePools.map((pool) => (
            <Pool
              metamask={metamask}
              library={library}
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
})
