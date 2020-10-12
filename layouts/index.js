import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Account from './Account'

const Wrapper = styled.div`
  height: 100vh;

  > * {
    max-width: 1440px;
    margin: auto;

    &:not(footer) {
      width: 100%;
    }
  }

  footer {
    min-width: 654px;
    border: 2px solid var(--color-blue);
    border-bottom: 0;
    border-radius: 7px 7px 0 0;
  }

  h1 {
    font-size: 32px;
    line-height: 49px;
    margin-bottom: 8px;
    color: var(--color-red);
  }

  h2 {
    font-size: 24px;
    line-height: 30px;
  }

  label {
    font-size: 16px;
    line-height: 20px;

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
    background-color: var(--color-red);
    color: var(--color-white);

    font-size: 20px;
    font-weight: bold;
    line-height: 25px;
    padding: 10px;

    &:disabled {
      opacity: 0.8;
      cursor: not-allowed;
    }

    &.white {
      background-color: var(--color-white);
      color: var(--color-red);
    }
  }
`

const Header = styled.header`
  padding: 50px 60px 20px;
  .logo {
    font-size: 30px;
    font-weight: bold;
    line-height: 38px;
  }
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  @media all and (max-width: 577px) {
    overflow: initial;
  }

  section {
    padding: 16px 0;

    > p {
      font-size: 16px;
      line-height: 20px;

      max-width: 943px;
      margin: 0 auto 30px;

      a {
        font-weight: bold;
        text-decoration: underline dotted;
        color: var(--color-red);
      }
    }
  }
`

const Footer = styled.footer`
  background: var(--color-black);
  padding: 12px;

  a {
    font-size: 16px;
    line-height: 20px;
    color: var(--color-white);
    margin: 0 12px;
  }
`

export default connect(({ library }) => ({ library }))(function Index({ library, children }) {
  return (
    <Wrapper className="flex-column">
      <Header className="flex-center justify-center relative">
        <div className="menu">
          <div className="hamburger"></div>
          <Link href="/">
            <div className="logo cursor">WHALE STREET</div>
          </Link>
        </div>
        <Account />
      </Header>
      <Content>{library ? children : <p className="fill flex-all">No connected wallet</p>}</Content>
      <Footer className="flex-center justify-center">
        <a>Discord</a>
        <a>Github</a>
        <a>Twitter</a>
        <a>Developer Docs</a>
        <a>Forum</a>
      </Footer>
    </Wrapper>
  )
})
