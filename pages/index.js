import styled from 'styled-components'
import Link from 'next/link'

const Wrapper = styled.section`
  .watch-video {
    display: inline-flex;
    align-items: center;

    text-decoration: underline;
    color: var(--color-red);

    img {
      margin-right: 10px;
    }
  }
`

const Statics = styled.div`
  border-radius: 12px;
  background-color: var(--color-black);
  color: var(--color-white);
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
    background-color: var(--color-red);
    border-radius: 50%;
    margin: 12px;
    box-shadow: var(--box-shadow);

    margin-bottom: 30px;

    label {
      font-style: italic;
      color: var(--color-white);
      position: absolute;
      bottom: -30px;
    }
  }

  .coming-soon {
    opacity: 0.24;
    cursor: not-allowed;
  }
`

const OurTokens = styled.div`
  margin-top: 28px;

  h2 {
    color: var(--color-white);
    marigin-bottom: 17px;
  }

  button {
    width: 130px;
    cursor: initial;
    border-radius: 10px;
    box-shadow: var(--box-shadow);

    font-size: 24px;
    line-height: 1;
    font-weight: bold;
  }
`

export default function Index() {
  return (
    <Wrapper className="center">
      <h1>Welcome to Whale Street.</h1>
      <p className="intro">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
        vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
        <br />
        <br />
        <a className="watch-video">
          <img src="/assets/video.png" alt="Welcome to Whale Street" />
          Watch Video
        </a>
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
        <Link href="/[base]" as="/lst">
          <div className="reward-token cursor flex-all relative">
            <img src="/assets/shrimp-farm.png" alt="Farm Shrimp" />
            <label>Farm Shrimp</label>
          </div>
        </Link>
        <div className="reward-token cursor flex-all relative coming-soon">
          <img src="/assets/gaffe-hoard.png" alt="Gaffe Hoard" />
          <label>Gaffe Hoard</label>
        </div>
        <div className="reward-token cursor flex-all relative coming-soon">
          <img src="/assets/swapmaster.png" alt="Swap Master" />
          <label>Swap Master</label>
        </div>
        <div className="reward-token cursor flex-all relative coming-soon">
          <img src="/assets/whaleswap.png" alt="Whale Swap" />
          <label>Whale Swap</label>
        </div>
        <div className="reward-token cursor flex-all relative coming-soon">
          <img src="/assets/noon-report.png" alt="Noon Report" />
          <label>Noon Report</label>
        </div>
      </RewardTokens>
      <OurTokens>
        <h2>Our Tokens</h2>
        <div className="buttons flex-center justify-center">
          <button>$hrimp</button>
          <button>LST</button>
          <button>NFT</button>
        </div>
      </OurTokens>
    </Wrapper>
  )
}
