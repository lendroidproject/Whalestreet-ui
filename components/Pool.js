import Link from 'next/link'
import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 307px;
  max-width: 100%;
  border: 2px solid var(--color-cyan);
  border-radius: 12px;
  background-color: var(--color-blue);
  padding: 23px 20px 26px;
  text-align: center;
  margin: 20px;
  color: var(--color-white);

  h2 {
    margin: 15px 0;
    color: var(--color-gold);
  }

  p {
    margin-bottom: 16px;
  }

  > button {
    width: 223px;
    border-radius: 7px;
    border: 2px solid var(--color-gold);
    box-shadow: var(--box-shadow);
  }
`

export const PoolIcon = styled.div`
  padding: 9px 20px 8px;
  border-radius: 30.5px;
  border: 2px solid var(--color-cyan);
  background-color: var(--color-blue);
  color: var(--color-white);
  box-shadow: var(--box-shadow-narrow);

  img {
    width: 44px;
    height: 44px;
    margin: 0 2px;
  }
`

export default function Pool({ base, pair, apy, rewardBase, rewards, coming }) {
  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <PoolIcon className="flex-center">
        <img src={`/assets/${base.toLowerCase()}.svg`} alt={base} />
        <img src={`/assets/${pair.toLowerCase()}.svg`} alt={pair} />
      </PoolIcon>
      <h2>
        {base}/{pair} POOL
      </h2>
      <p className="apy">APY {apy}%</p>
      <label>Percentage of {rewardBase} rewards</label>
      <p className="reward">{rewards}%</p>
      {coming ? (
        <button className="uppercase" disabled>
          Coming soon
        </button>
      ) : (
        <Link href="/[base]/[pair]" as={`/${base.toLowerCase()}/${pair.toLowerCase()}`}>
          <button className="uppercase">Select</button>
        </Link>
      )}
    </Wrapper>
  )
}
