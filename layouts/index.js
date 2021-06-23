import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as ethUtil from 'ethereumjs-util'

import { agreePrivacy, getPrivacy } from 'utils/requests'
import PriceMarquee from 'components/common/PriceMarquee'
import Spinner from 'components/common/Spinner'
import Account from './Account'

import { OurTokens } from 'components/styles'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import 'katex/dist/katex.min.css'
import { mediaSize, withMedia } from 'utils/media'

import useWallet from 'hooks/useWallet'
import Library from 'whalestreet-js'
import { isSupportedNetwork, networks, tokenLink, INFURAS } from 'utils/etherscan'
import { addresses } from './constants'

const Wrapper = styled.div`
  height: 100vh;
  padding: 0 30px;
  ${withMedia(null, 'padding', ['0px 30px', '0px 45px', '0px, 60px', '0px 20px'])}

  .bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    max-width: unset;
    justify-content: center;

    img {
      width: 100%;
      min-height: 100%;
    }

    ${withMedia('video', 'width', ['100%', 'unset', 'unset', 'unset'])}
    ${withMedia('video', 'height', ['unset', '100%', '100%', '100%'])}
  }

  > * {
    margin: auto;
    width: 100%;
    ${withMedia(null, 'max-width', ['1440px', '2048px', '2880px', 'unset'])}
  }

  .limited,
  section > p {
    ${withMedia(null, 'max-width', ['952px', '1428px', '2380px', 'unset'])}
    ${withMedia('&.margin', 'max-width', ['968px', '1444px', '2396px', 'unset'])}
  }

  h1 {
    margin-bottom: 6px;
    color: var(--color-red);
    text-transform: uppercase;
    ${withMedia(null, 'font-size', ['24px', '36px', '48px', '20px'])}
  }

  h2 {
    ${withMedia(null, 'font-size', ['20px', '30px', '40px', '18px'])}
  }

  label {
    + p {
      margin-top: 6px;
      ${withMedia(null, 'font-size', ['24px', '36px', '48px', '18px'])}
    }
  }

  p {
    margin-bottom: 0;
    ${withMedia(null, 'font-size', ['16px', '24px', '32px', '12px'])}
  }

  .buttons {
    button {
      margin: 0 18px;
    }
  }

  button {
    background-color: var(--color-black);
    color: var(--color-white);
    padding: 8px;
    ${withMedia(null, 'font-size', ['20px', '30px', '40x', '16px'])}

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

  ${mediaSize.mobile} {
    .marquee {
      opacity: 0;
      z-index: -1;
    }
  }

  &.auctions {
    .balance-item {
      background: var(--color-red2);
      + div > .cursor {
        background: var(--color-red2);
      }
    }
    *[role='menu'] {
      background: var(--color-red2);
    }
    button.blue {
      background: var(--color-red2);
    }
    h1 {
      color: var(--color-red2);
    }
    footer a {
      color: var(--color-blue2);
    }
  }
`

const Header = styled.header`
  padding: 44px 0 24px;
  margin: auto;

  .menu a {
    display: flex;
  }

  .hamburger {
    position: absolute;
    left: 65px;
    top: 58px;
  }

  ${mediaSize.mobile} {
    padding: 16px 24px 12px;
    flex-direction: column-reverse;

    .account {
      margin-bottom: 16px;
    }
  }
  ${withMedia('.logo', 'height', ['60px', '80px', '100px', '50px'])}
`

const Content = styled.div`
  flex: 1;
  overflow: hidden auto;
  position: relative;
  ${mediaSize.mobile} {
    overflow: initial;
  }

  * {
    transition: all 0.2s;
  }

  section {
    padding-bottom: 36px;

    > p {
      margin: 0 auto;
      ${withMedia(null, 'font-size', ['16px', '24px', '32x', '12px'])}
      ${withMedia(null, 'margin-bottom', ['24px', '32px', '48x', '16px'])}
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
  ${mediaSize.mobile} {
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
    ${withMedia(null, 'font-size', ['16px', '24px', '32x', '12px'])}
  }

  .copyright {
    white-space: nowrap;
    font-size: 90%;
  }

  ${mediaSize.tablet} {
    flex-wrap: wrap;
    .copyright {
      width: 100%;
    }
  }
`

const defaultNetwork = networks[0]

export default connect((state) => state)(function Index({ wallet, account, children, dispatch }) {
  const [, connectWallet] = useWallet()
  const network = account?.network || wallet?.network || defaultNetwork

  const handleEvent = (event, data) => {
    dispatch({
      type: event,
      payload: data,
    })
  }
  const handleConnect = () => {
    connectWallet()
      .then((provider) => {
        if (provider) {
          wallet.connect(provider)
        }
      })
      .catch((err) => {
        // tslint:disable-next-line: no-console
        console.log('connectWallet', err)
      })
  }
  useEffect(() => {
    const wallet = new Library.Wallet({
      network: defaultNetwork,
      addresses,
      INFURA_ID: `${INFURAS[defaultNetwork]}/${process.env.INFURA_ID}`,
      OnEvent: handleEvent,
      registers: ['farming'],
    })
    dispatch({
      type: 'WALLET',
      payload: [wallet, connectWallet],
    })
  }, [])

  const isSupported = !wallet || isSupportedNetwork(network)
  const [[address, termsAgreed], handleTerms] = useState(['', false])
  const setTermsAgreed = (flag) => handleTerms([account.address, flag])
  const [fetched, setFetched] = useState(false)
  const [signning, setSignning] = useState(1)

  const router = useRouter()
  const isAdmin = router.pathname === '/market-admin'
  const isPage = ['/', '/farming', '/farm-b20'].includes(router.route)

  const [pageName, setPageName] = useState('')
  useEffect(() => {
    const newPage = router.route
      .split('/')
      .filter((item) => item)
      .join('-')
    if (pageName) {
      document.body.classList.remove(pageName)
    }
    if (newPage) {
      document.body.classList.add(newPage)
    }
    setPageName(newPage)
  }, [router.route])

  useEffect(() => {
    if (!account) return
    if (fetched && address && address !== account.address) {
      setFetched(false)
      setTermsAgreed(false)
    } else if (!fetched && !termsAgreed && account.address) {
      getPrivacy(account.address)
        .then((data) => {
          setFetched(true)
          if (data.result && data.result.signature) setTermsAgreed(true)
          else {
            setTermsAgreed(false)
            setSignning(-1)
          }
        })
        .catch((err) => {
          console.log(err)
          setTermsAgreed(false)
          setSignning(-1)
        })
    }
  }, [account])

  useEffect(() => {
    if (account?.address && !termsAgreed && signning === -1) {
      signTerms(account)
    }
  }, [account, termsAgreed, signning])

  const signTerms = (account) => {
    if ((!account.network && !account.address) || termsAgreed || signning == 1) return
    setSignning(1)
    const message = `I acknowledge and accept the Terms and Conditions as specified in the link below

      https://whalestreet.xyz/assets/WH_Labs_International_Limited.pdf`
    const msg = ethUtil.bufferToHex(Buffer.from(message, 'utf8'))

    const from = account.address

    const params = [msg, from]

    wallet.web3.eth.personal.sign(...params, function (err, result) {
      if (err || result.error) setSignning(0)
      if (err) return console.error(err)
      if (result.error) return console.error('ERROR', result)

      const res = (result.result || result).slice(2)
      const v = parseInt(res.slice(128, 130), 16) === 27 ? 0 : 1
      const r = wallet.web3.utils.toBN(`0x${res.slice(0, 64)}`).toString()
      const s = wallet.web3.utils.toBN(`0x${res.slice(64, 128)}`).toString()

      agreePrivacy(from, {
        network: account.network,
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
    })
  }

  const back = (
    <div className="bg flex-all">
      {pageName === 'auctions' && <img src="/assets/bg_auction.jpg" alt="Auctions" />}
      {pageName !== 'auctions' && (
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )

  if (!wallet) return back

  return (
    <Wrapper className={`flex-column ${pageName}`}>
      <Header className="flex-center justify-between relative limited">
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
        <Account isAdmin={isAdmin} onConnect={() => handleConnect()} />
      </Header>
      <Content>
        {isSupported && account?.address && !termsAgreed ? (
          fetched ? (
            <div className="fill flex-all no-wallet">
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
              <button onClick={() => signTerms(account)} disabled={signning === 1}>
                I Agree
              </button>
            </div>
          ) : (
            <Spinner />
          )
        ) : (
          <>
            {children}
            {isPage && (
              <OurTokens className="center">
                <h2>Tokens</h2>
                <div className="buttons flex-center justify-center">
                  <a href={tokenLink(addresses[network].$HRIMP, network)} target="_blank">
                    <button>
                      $hrimp <img src="/assets/link-icon.svg" />
                    </button>
                  </a>
                  <a href={tokenLink(addresses[network].LST, network)} target="_blank">
                    <button>
                      LST <img src="/assets/link-icon.svg" />
                    </button>
                  </a>
                  {/* <a href="#" target="_blank" onClick={(e) => e.preventDefault()}>
                    <button disabled>
                      NFT <img src="/assets/link-icon.svg" />
                    </button>
                  </a> */}
                </div>
              </OurTokens>
            )}
          </>
        )}
        {back}
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
