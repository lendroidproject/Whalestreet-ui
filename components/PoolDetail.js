import Link from 'next/link'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Wrapper as PoolWrapper, PoolIcon } from './Pool'

const Wrapper = styled(PoolWrapper)`
  width: 654px;
  margin-top: 75px;
  position: relative;

  > button {
    font-size: 20px;
    font-weight: bold;
    line-height: 25px;
    padding: 0;
    width: auto;
    border-raidus: 0;

    position: absolute;
    left: 0;
    top: -50px;

    img {
      margin-right: 9px;
    }
  }
`

const Detail = styled.div`
  text-align: left;
  width: 100%;

  label + p {
    margin-top: 12px;
  }

  .actions {
    margin: 29px -7px -7px;

    button {
      border: 1px solid var(--color-button-border);
      border-radius: 10px;
      background-color: var(--color-button-back);
      color: var(--color-black);

      display: flex;
      align-items: center;
      margin: 7px;
      padding: 8px 12px;
      font-weight: normal;

      img {
        margin-right: 8px;
      }
    }
  }
`

export default function Pool({ detail, base, pair, rewardBase, stake }) {
  const [info, setInfo] = useState(detail ? {} : null)

  useEffect(() => {
    //
  }, [])

  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <Link href={`/${base.toLowerCase()}`}>
        <button className="white">
          <img src="/assets/back.svg" alt="Go Back" />
          Back
        </button>
      </Link>
      <PoolIcon className="flex-center">
        <img src={`/assets/${base.toLowerCase()}.svg`} alt={base} />
        <img src={`/assets/${pair.toLowerCase()}.svg`} alt={pair} />
      </PoolIcon>
      <h2>
        {base}/{pair} POOL
      </h2>
      <Detail className="flex justify-around">
        <div className="stake">
          <label>{stake} Staked</label>
          <p>{info.stake || 0}</p>
          <div className="actions flex">
            <button>
              <img src="/assets/stake.svg" alt="Stake" />
              Stake
            </button>
            <button>
              <img src="/assets/unstake.svg" alt="Unstake" />
              Unstake
            </button>
          </div>
        </div>
        <div className="claim">
          <label>Unclaimed {rewardBase} Tokens</label>
          <p>{info.claim || 0}</p>
          <div className="actions flex">
            <button>
              <img src={`/assets/claim-${rewardBase}.svg`} alt="Unstake" />
              Claim {rewardBase}
            </button>
          </div>
        </div>
      </Detail>
    </Wrapper>
  )
}
