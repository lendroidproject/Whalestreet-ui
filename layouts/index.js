import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as ethUtil from 'ethereumjs-util'

import { connectNetworks, isSupportedNetwork, tokenLink } from 'utils/etherscan'
import { agreePrivacy, getPrivacy } from 'utils/requests'
import PriceMarquee from 'components/common/PriceMarquee'
import Spinner from 'components/common/Spinner'
import Account from './Account'

import { OurTokens } from 'components/styles'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import 'katex/dist/katex.min.css'

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
    @media all and (min-width: 2400px) {
      max-width: 2048px;
    }
    @media all and (min-width: 3200px) {
      max-width: 2880px;
    }
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
    font-size: 20px;
    line-height: 28px;
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

  .__react_component_tooltip {
    padding: 9px 9px 3px;
    font-size: 12px;
    line-height: 16px;

    &.show {
      opacity: 1;
      z-index: 999;
    }
  }
`

const Header = styled.header`
  padding: 44px 0 24px;
  margin: auto;

  max-width: 952px;
  @media all and (min-width: 2400px) {
    max-width: 1428px;
  }
  @media all and (min-width: 3200px) {
    max-width: 2380px;
  }

  .menu a {
    display: flex;
  }

  .hamburger {
    position: absolute;
    left: 65px;
    top: 58px;
  }

  .logo {
    height: 60px;
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

  @media all and (min-width: 2400px) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    video {
      height: 100%;
    }
  }

  * {
    transition: all 0.2s;
  }

  section {
    padding-bottom: 36px;

    > p {
      font-size: 16px;
      line-height: 20px;
      margin: 0 auto 24px;

      @media all and (max-width: 577px) {
        font-size: 12px;
        line-height: 16px;
      }

      max-width: 952px;
      @media all and (min-width: 2400px) {
        max-width: 1428px;
      }
      @media all and (min-width: 3200px) {
        max-width: 2380px;
      }
    }
  }

  .no-wallet {
    color: var(--color-red);

    button {
      margin-top: 24px;
    }
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
  const isSupported = !metamask.network || isSupportedNetwork(metamask.network)
  const [[address, termsAgreed], handleTerms] = useState(['', false])
  const setTermsAgreed = (flag) => handleTerms([metamask.address, flag])
  const [fetched, setFetched] = useState(false)
  const [signning, setSignning] = useState(1)

  const router = useRouter()
  const isAdmin = router.pathname === '/market-admin'

  useEffect(() => {
    if (fetched && address && address !== metamask.address) {
      setFetched(false)
      setTermsAgreed(false)
    } else if (!fetched && !termsAgreed && metamask.address) {
      setFetched(true)
      getPrivacy(metamask.address)
        .then((data) => {
          if (data.result && data.result.signature) setTermsAgreed(true)
          else {
            setTermsAgreed(false)
            setSignning(-1)
          }
        })
        .catch(console.log)
    }
  }, [metamask])

  useEffect(() => {
    if (library && metamask.network && metamask.address && !termsAgreed && signning === -1) {
      signTerms(metamask)
    }
  }, [library, metamask, termsAgreed, signning])

  const signTerms = (metamask) => {
    if ((!metamask.network && !metamask.address) || termsAgreed || signning == 1) return
    setSignning(1)
    const message = `I acknowledge and accept the Terms and Conditions as specified in the link below

      https://whalestreet.xyz/assets/WH_Labs_International_Limited.pdf`
    const msg = ethUtil.bufferToHex(Buffer.from(message, 'utf8'))

    const from = metamask.address

    const params = [msg, from]
    // const method = 'personal_sign'

    library.web3.eth.personal.sign(
      ...params,
      // {
      //   method,
      //   params,
      //   from,
      // },
      function (err, result) {
        if (err || result.error) setSignning(0)
        if (err) return console.error(err)
        if (result.error) return console.error('ERROR', result)

        const res = (result.result || result).slice(2)
        const v = parseInt(res.slice(128, 130), 16) === 27 ? 0 : 1
        const r = library.web3.utils.toBN(`0x${res.slice(0, 64)}`).toString()
        const s = library.web3.utils.toBN(`0x${res.slice(64, 128)}`).toString()

        agreePrivacy(from, {
          network: metamask.network,
          message,
          signature: result.result || result,
          v,
          r,
          s,
        })
          .then((data) => {
            setTermsAgreed(true)
          })
          .catch(console.log)
          .finally(() => setSignning(0))
      }
    )
  }

  return (
    <Wrapper className="flex-column">
      <Header className="flex-center justify-between relative">
        <div className="menu flex">
          {isAdmin && (
            <div className="hamburger">
              <img src="/assets/menu-white.svg" alt="Menu" />
            </div>
          )}
          <Link href="/">
            <img className="logo cursor" src="/assets/logo.svg" alt="WHALE STREET" />
          </Link>
        </div>
        <Account isAdmin={isAdmin} />
      </Header>
      <Content>
        {isSupported && termsAgreed && metamask && metamask.connected ? (
          <>
            {children}
            <OurTokens className="center">
              <h2>Tokens</h2>
              <div className="buttons flex-center justify-center">
                <a href={tokenLink(library.addresses.$HRIMP, metamask.network)} target="_blank">
                  <button>
                    $hrimp <img src="/assets/link-icon.svg" />
                  </button>
                </a>
                <a href={tokenLink(library.addresses.LST, metamask.network)} target="_blank">
                  <button>
                    LST <img src="/assets/link-icon.svg" />
                  </button>
                </a>
                <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>
                  <button disabled>
                    NFT <img src="/assets/link-icon.svg" />
                  </button>
                </a>
              </div>
            </OurTokens>
          </>
        ) : metamask && metamask.connected && isSupported ? (
          <>
            <div className="bg flex-all">
              <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
                <source src="/assets/bg.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="fill flex-all no-wallet">
              {!library ? (
                <p>No connected wallet</p>
              ) : !fetched || signning ? (
                <Spinner />
              ) : (
                <>
                  <p>
                    Agree{' '}
                    <a href="/assets/WH_Labs_International_Limited.pdf" target="_blank">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="/assets/WH_Labs_Privacy.pdf" target="_blank">
                      Privacy
                    </a>
                  </p>
                  <button onClick={() => signTerms(metamask)} disabled={signning === 1}>
                    I Agree
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg flex-all">
              <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
                <source src="/assets/bg.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="fill flex-all no-wallet">{connectNetworks()}</p>
          </>
        )}
      </Content>
      <Footer className="flex-center">
        <div className="flex-center justify-center flex-wrap" style={{ width: '100%' }}>
          <a className="uppercase" href="https://blog.whalestreet.xyz/" target="_blank">
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
          <a
            className="uppercase"
            href="https://docs.google.com/document/d/1cDNOpdCgI0ZwymjSSOEJIVGFiOYPQ53Y9GFTOaovfLE/edit?usp=sharing"
            target="_blank"
          >
            Docs
          </a>
          {/* <a
            className="uppercase"
            href="https://github.com/lendroidproject/Whalestreet-contracts/blob/main/audit-farming.pdf"
            target="_blank"
          >
            Audit Report
          </a> */}
          <a className="uppercase" href="https://github.com/lendroidproject/Whalestreet-contracts" target="_blank">
            Github
          </a>
          <a className="uppercase" href="/assets/WH_Labs_Privacy.pdf" target="_blank">
            Privacy
          </a>
          <a className="uppercase" href="/assets/WH_Labs_International_Limited.pdf" target="_blank">
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
