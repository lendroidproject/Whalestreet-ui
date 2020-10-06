import styled from 'styled-components'
import { connect } from 'react-redux'
import Link from 'next/link'

const Wrapper = styled.section``

const Statics = styled.div`
  border-radius: 12px;
  background-color: var(--color-grey);
  max-width: 943px;
  margin: 0 auto 53px;
  padding: 11px 20px 7px;
  text-align: left;

  .statics__item {
    margin: 10px 20px;
  }
`

const RewardTokens = styled.div`
  .reward-token {
    height: 181px;
    width: 181px;
    border: 1px solid var(--color-black);
    border-radius: 50%;
    margin: 12px;

    img {
      height: 74px;
      margin-bottom: 16px;
    }

    label {
      font-weight: bold;
    }
  }
`

const OurTokens = styled.div`
  margin-top: 28px;
  margin-bottom: 20px;

  h2 {
    marign-bottom: 30px;
  }

  button {
    border-radius: 25px;
    width: 130px;
  }
`

export default connect((state) => state)(function ({ metamask, library, ...props }) {
  // console.log(metamask, library, props)

  return (
    <Wrapper className="center">
      <h1>Welcome to Whale Street.</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
        vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
        consequuntur magni.
        <br />
        <br />
        <a>Watch Video</a>
      </p>
      <Statics className="flex-center justify-between">
        <div className="statics__item">
          <label>$hrimp Balance</label>
          <p>2402</p>
        </div>
        <div className="statics__item">
          <label>$hrimp Price</label>
          <p>$0.02567</p>
        </div>
        <div className="statics__item">
          <label>$hrimp Total Supply</label>
          <p>92,292,34</p>
        </div>
        <div className="statics__item">
          <label>LST Price</label>
          <p>$0.00119713</p>
        </div>
      </Statics>
      <RewardTokens className="flex-center justify-center">
        <div className="reward-token flex-all">
          <img src="/assets/shrimp.svg" alt="Farm Shrimp" />
          <label>Farm Shrimp</label>
        </div>
        <div className="reward-token flex-all">
          <img src="/assets/gaffehoard.svg" alt="Gaffe Hoard" />
          <label>Gaffe Hoard</label>
        </div>
        <div className="reward-token flex-all">
          <img src="/assets/swapmaster.svg" alt="Swap Master" />
          <label>Swap Master</label>
        </div>
        <div className="reward-token flex-all">
          <img src="/assets/whaleswap.svg" alt="Whale Swap" />
          <label>Whale Swap</label>
        </div>
        <div className="reward-token flex-all">
          <img src="/assets/noon-rpeort.svg" alt="Noon Report" />
          <label>Noon Report</label>
        </div>
      </RewardTokens>
      <OurTokens>
        <h2>Our Tokens</h2>
        <div className="buttons flex-center justify-center">
          <button disabled>$hrimp</button>
          <Link href="/lst">
            <button>LST</button>
          </Link>
          <button disabled>NFT</button>
        </div>
      </OurTokens>
    </Wrapper>
  )
})
