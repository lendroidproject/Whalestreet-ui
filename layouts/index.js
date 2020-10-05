import styled from 'styled-components'

import Account from './Account'

const Wrapper = styled.div`
  height: 100vh;

  h1 {
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 14px;
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
  @media all and (max-width: 577px) {
    overflow: initial;
  }

  section {
    p {
      max-width: 943px;
      margin: 0 auto 30px;

      a {
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
`

const Footer = styled.footer`
  background: var(--color-black);
  padding: 15px;

  a {
    font-size: 16px;
    line-height: 20px;
    color: var(--color-white);
    margin: 0 15px;
  }
`

export default function Index({ children }) {
  return (
    <Wrapper className="flex-column">
      <Header className="flex-center justify-between">
        <div className="menu">
          <div className="hamburger"></div>
          <div className="logo">WHALE STREET</div>
        </div>
        <Account />
      </Header>
      <Content>{children}</Content>
      <Footer className="flex-center justify-center">
        <a>Discord</a>
        <a>Github</a>
        <a>Twitter</a>
        <a>Developer Docs</a>
        <a>Forum</a>
      </Footer>
    </Wrapper>
  )
}
