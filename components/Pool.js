import Link from 'next/link'
import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 307px;
  max-width: 100%;
  border-radius: 12px;
  background-color: var(--color-blue);
  padding: 23px 20px 26px;
  text-align: center;
  margin: 20px;
  color: var(--color-white);

  h2 {
    line-height: 38px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  p {
    line-height: 36px;
    margin-bottom: 13px;
  }

  label.light {
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
  }

  label + p {
    margin-top: 2px;
  }

  > button {
    width: 223px;
    border-radius: 7px;
  }
`

export const PoolIcon = styled.div`
  padding: 14px 20px 6px;
  border-radius: 30.5px;
  color: var(--color-white);

  img {
    width: 36px;
    height: 36px;
    margin: 0 3px;
  }
`

export default function Pool({ base, pair, apy, rewardBase, rewards, coming }) {
  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <PoolIcon className="flex-center">
        <img src={`/assets/${base.toLowerCase()}-token.svg`} alt={base} />
        <img src={`/assets/${pair.toLowerCase()}-token.svg`} alt={pair} />
      </PoolIcon>
      <h2>
        {base}/{pair} POOL
      </h2>
      <p className="apy">APY {apy}%</p>
      <label className="light uppercase">Percentage of {rewardBase} rewards</label>
      <p className="reward">{rewards}%</p>
      {coming ? (
        <button className="uppercase red" disabled>
          Coming soon
        </button>
      ) : (
        <Link href="/[base]/[pair]" as={`/${base.toLowerCase()}/${pair.toLowerCase()}`}>
          <button className="uppercase red">Select</button>
        </Link>
      )}
    </Wrapper>
  )
}
