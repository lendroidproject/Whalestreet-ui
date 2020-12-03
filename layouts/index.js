import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'

import PriceMarquee from 'components/common/PriceMarquee'
import Account from './Account'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'

const Wrapper = styled.div`
  height: 100vh;
  padding: 0 30px;

  @media all and (max-width: 577px) {
    padding: 0 20px;

    .marquee {
      opacity: 0;
      z-index: -1;
    }
  }

  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    max-width: unset;
    justify-content: stretch;

    img {
      width: 100%;
      min-height: 100%;
    }
  }

  > * {
    max-width: 1440px;
    margin: auto;
    width: 100%;
  }

  h1 {
    font-size: 24px;
    line-height: 36px;
    margin-bottom: 6px;
    color: var(--color-red);
    text-transform: uppercase;
    @media all and (max-width: 577px) {
      font-size: 20px;
      line-height: 29px;
    }
  }

  h2 {
    font-size: 24px;
    line-height: 30px;
    @media all and (max-width: 577px) {
      font-size: 20px;
      line-height: 24px;
    }
  }

  label {
    + p {
      margin-top: 6px;
    }
  }

  p {
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 0;
    @media all and (max-width: 577px) {
      font-size: 18px;
      line-height: 26px;
    }
  }

  .buttons {
    button {
      margin: 0 18px;
    }
  }

  button {
    background-color: var(--color-black);
    color: var(--color-white);

    font-size: 20px;
    line-height: 25px;
    padding: 10px;
    @media all and (max-width: 577px) {
      font-size: 16px;
      line-height: 24px;
      padding: 8px;
    }

    &:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }

    &.red {
      background-color: var(--color-red);
    }

    &.blue {
      background-color: var(--color-blue);
    }

    &.white {
      background-color: transparent;
      color: var(--color-red);
    }
  }
`

const Header = styled.header`
  padding: 44px 65px 24px;

  .menu a {
    display: flex;
  }

  @media all and (max-width: 577px) {
    padding: 16px 24px 12px;
    flex-direction: column-reverse;

    .account {
      margin-bottom: 16px;
    }

    .logo {
      height: 50px;
    }
  }
`

const Content = styled.div`
  flex: 1;
  overflow: hidden auto;
  position: relative;
  @media all and (max-width: 577px) {
    overflow: initial;
  }

  * {
    transition: all 0.2s;
  }

  section {
    padding-bottom: 36px;

    > p {
      font-size: 16px;
      line-height: 20px;

      max-width: 943px;
      margin: 0 auto 24px;

      @media all and (max-width: 577px) {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  .no-wallet {
    color: var(--color-red);
  }
`

const Footer = styled.footer`
  background: var(--color-white);
  padding: 8px;

  max-width: unset;
  z-index: 10;
  width: calc(100% + 60px);
  left: -30px;
  position: relative;
  @media all and (max-width: 577px) {
    padding: 9px;
    width: calc(100% + 40px);
    left: -20px;
    justify-content: center;
  }

  a {
    margin: 3px 12px;
    white-space: nowrap;
    color: var(--color-black);
    text-decoration: none;
    @media all and (max-width: 577px) {
      font-size: 11px;
      line-height: 16px;
      margin: 3px 12px;
    }
  }

  .copyright {
    white-space: nowrap;
    font-size: 90%;
  }

  @media all and (max-width: 767px) {
    flex-wrap: wrap;
    .copyright {
      width: 100%;
    }
  }
`

export default connect((state) => state)(function Index({ library, metamask, children }) {
  return (
    <Wrapper className="flex-column">
      <Header className="flex-center justify-center relative">
        <div className="menu flex">
          <div className="hamburger"></div>
          <Link href="/">
            <img className="logo cursor" src="/assets/logo.svg" alt="WHALE STREET" />
          </Link>
        </div>
        <Account />
      </Header>
      <Content>{library ? children : <p className="fill flex-all no-wallet">No connected wallet</p>}</Content>
      <Footer className="flex-center">
        <div className="flex-center justify-center flex-wrap" style={{ width: '100%' }}>
          <a className="uppercase" href="https://getshrimp.medium.com" target="_blank">
            Blog
          </a>
          <a className="uppercase" href="https://discord.com/invite/pEbSg4qp3y" target="_blank">
            Discord
          </a>
          <a className="uppercase" href="https://twitter.com/WhaleStreetoffl" target="_blank">
            Twitter
          </a>
          <a
            className="uppercase"
            href="https://app.uniswap.org/#/add/0x4de2573e27e648607b50e1cfff921a33e4a34405/ETH"
            target="_blank"
          >
            Add LP
          </a>
          <a className="uppercase" href="/" target="_blank">
            Docs
          </a>
          <a className="uppercase" href="/" target="_blank">
            Audit Report
          </a>
          <a className="uppercase" href="https://github.com/lendroidproject/Whalestreet-contracts" target="_blank">
            Github
          </a>
          <a className="uppercase" href="/" target="_blank">
            Privacy
          </a>
          <a className="uppercase" href="/" target="_blank">
            Terms
          </a>
        </div>
        <div className="flex-center justify-center flex-wrap copyright">Copyright &copy; WH Labs Limited</div>
      </Footer>
      <div className="bg flex-all">
        <PriceMarquee />
      </div>
    </Wrapper>
  )
})
