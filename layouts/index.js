import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Account from './Account'

const Wrapper = styled.div`
  height: 100vh;
  background-image: url(/assets/bg.jpg);
  background-position: center;
  background-repeat: no-repeat;

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
  }

  h2 {
    font-size: 24px;
    line-height: 30px;
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
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  @media all and (max-width: 577px) {
    overflow: initial;
  }

  section {
    padding-bottom: 36px;

    > p {
      font-size: 16px;
      line-height: 20px;

      max-width: 943px;
      margin: 0 auto 24px;
    }
  }

  .no-wallet {
    color: var(--color-red);
  }
`

const Footer = styled.footer`
  background: var(--color-white);
  padding: 8px;

  a {
    margin: 0 24px;
  }
`

export default connect(({ library }) => ({ library }))(function Index({ library, children }) {
  return (
    <Wrapper className="flex-column">
      <Header className="flex-center justify-center relative">
        <div className="menu">
          <div className="hamburger"></div>
          <Link href="/">
            <img className="logo cursor" src="/assets/logo.png" alt="WHALE STREET" />
          </Link>
        </div>
        <Account />
      </Header>
      <Content>{library ? children : <p className="fill flex-all no-wallet">No connected wallet</p>}</Content>
      <Footer className="flex-center justify-center">
        <a className="uppercase">Discord</a>
        <a className="uppercase">Github</a>
        <a className="uppercase">Twitter</a>
        <a className="uppercase">Developer Docs</a>
        <a className="uppercase">Forum</a>
      </Footer>
    </Wrapper>
  )
})
