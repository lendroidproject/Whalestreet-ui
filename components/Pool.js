import Link from 'next/link'
import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 307px;
  max-width: 100%;
  border-radius: 12px;
  background-color: var(--color-blue);
  padding: 23px 23px 26px;
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
    margin-top: 10px;
    margin-bottom: 10px;
  }

  p {
    line-height: 36px;
    margin-bottom: 13px;
    @media all and (max-width: 577px) {
      margin-bottom: 0;
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

  .pool-data button {
    width: 223px;
    border-radius: 7px;
    @media all and (max-width: 577px) {
      width: 100px;
      margin-left: 15px;
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
  padding: 14px 20px 6px;
  border-radius: 30.5px;
  color: var(--color-white);
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

export default function Pool({ base, pair, apy, rewardBase, rewards, coming }) {
  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
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
        <p className="apy">APY {apy}%</p>
      </div>
      <div className="pool-data">
        <div className="pool-data__detail">
          <label className="light uppercase">Percentage of {rewardBase} rewards</label>
          <p className="reward">{rewards}%</p>
        </div>
        {coming ? (
          <button className="uppercase red" disabled>
            Select
          </button>
        ) : (
          <Link href="/[base]/[pair]" as={`/${base.toLowerCase()}/${pair.toLowerCase()}`}>
            <button className="uppercase red">Select</button>
          </Link>
        )}
      </div>
    </Wrapper>
  )
}
