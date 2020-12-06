import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as ethUtil from 'ethereumjs-util'

import PriceMarquee from 'components/common/PriceMarquee'
import Account from './Account'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'
import { connectNetworks, isSupportedNetwork } from 'utils/etherscan'

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
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [signning, setSignning] = useState(true)

  useEffect(() => {
    const storageAgreedFlag = window.localStorage.getItem('termsAgreed')
    if (storageAgreedFlag) {
      const signData = JSON.parse(storageAgreedFlag)
      if (
        signData.ethereum_address === window.ethereum.selectedAddress &&
        signData.network_id === window.ethereum.networkVersion
      )
        setTermsAgreed(true)
      else if (termsAgreed) setTermsAgreed(false)
    }
  }, [metamask])

  useEffect(() => {
    if (library && metamask.network && metamask.address && !termsAgreed && !signning) {
      setSignning(true)
      signTerms(metamask)
    }
  }, [library, metamask, termsAgreed])

  const typedSignTerms = (metamask) => {
    if (!metamask.network && !metamask.address) return
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: metamask.network,
        // Give a user friendly name to the specific contract you are signing for.
        name: 'WH Labs Limited',
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: library.addresses.$HRIMP,
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '1',
      },
      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: `
          I hereby confirm that the WhaleStreet\n
          <a href="https://whalestreet.xyz/assets/WH_Labs_Privacy.pdf" target="_blank">Privacy Policy</a> and
          <a href="https://whalestreet.xyz/assets/WH_Labs_International_Limited.pdf" target="_blank">Terms and Conditions</a> are acceptable by me.
        `,
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [{ name: 'contents', type: 'string' }],
        // Not an EIP712Domain definition
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    })

    const from = metamask.address

    const params = [from, msgParams]
    const method = 'eth_signTypedData_v4'

    window.ethereum.sendAsync(
      {
        method,
        params,
        from,
      },
      function (err, result) {
        if (err) return console.dir(err)
        if (result.error) {
          alert(result.error.message)
        }
        if (result.error) return console.error('ERROR', result)
        console.log('TYPED SIGNED:' + JSON.stringify(result.result))

        // window.localStorage.setItem(
        //   'termsAgreed',
        //   JSON.stringify({
        //     network_id: window.ethereum.networkVersion,
        //     ethereum_address: from,
        //     signed_message_hash: result.result,
        //   })
        // )
        setTermsAgreed(true)
      }
    )
  }

  const signTerms = (metamask) => {
    if (!metamask.network && !metamask.address) return
    const msg = ethUtil.bufferToHex(
      Buffer.from(
        `
          I hereby confirm that the WhaleStreet

          - [Terms of Use](https://whalestreet.xyz/assets/WH_Labs_Privacy.pdf)
          - [Privacy](https://whalestreet.xyz/assets/WH_Labs_International_Limited.pdf)
        `,
        'utf8'
      )
    )

    const from = metamask.address

    const params = [msg, from]
    const method = 'personal_sign'

    window.ethereum.sendAsync(
      {
        method,
        params,
        from,
      },
      function (err, result) {
        if (err) return console.error(err)
        if (result.error) return console.error('ERROR', result)
        console.log('TYPED SIGNED:' + JSON.stringify(result.result))

        window.localStorage.setItem(
          'termsAgreed',
          JSON.stringify({
            network_id: window.ethereum.networkVersion,
            ethereum_address: from,
            signed_message_hash: result.result,
          })
        )
        setTermsAgreed(true)
      }
    )
  }

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
      <Content>
        {isSupported ? (
          (termsAgreed || true) && library ? (
            children
          ) : (
            <>
              <div className="bg flex-all">
                <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
                  <source src="/assets/bg.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="fill flex-all no-wallet">
                {!library ? (
                  <p>No connected wallet</p>
                ) : (
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
                )}
                {library && <button onClick={() => signTerms(metamask)}>I Agree</button>}
              </div>
            </>
          )
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
          {/* <a className="uppercase" href="https://getshrimp.medium.com" target="_blank">
            Blog
          </a> */}
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
