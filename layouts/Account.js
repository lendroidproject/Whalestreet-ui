import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Library from 'whalestreet-js'
import { shorten } from 'utils/string'
import { infuras, isSupportedNetwork, networkLabel, networks } from 'utils/etherscan'
import { tokens, uniV2s, uniV2Labels, pools, uniV2Pools, addresses, auctionAddresses } from './constants'
import { mediaSize, withMedia } from 'utils/media'

const Wrapper = styled.div`
  ${withMedia(null, 'transform', [null, 'scale(1.5)', 'scale(2)', null])}
  .connect {
    font-size: 14px;
    line-height: 15px;

    border-radius: 14px;
    padding: 6px 15px;
  }
`

const Balances = styled.div`
  z-index: 1;
  position: relative;

  .mobile {
    display: none;
    ${mediaSize.mobile} {
      display: initial;
    }
  }

  .balance-item {
    background: var(--color-blue);
    padding: 4px 8px 4px 6px;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-white);
    border-radius: 15px;
    margin-right: 12px;

    img {
      height: 20px;
      margin-right: 4px;
    }
    ${mediaSize.mobile} {
      display: none;
    }
  }

  *[role='menu'] {
    border-radius: 0 0 4px 4px;
    background-color: var(--color-blue);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: none;
    width: 100%;
    padding: 0;
    z-index: -1;
    top: 0;
    border-radius: 14px;
    padding-top: 28px;
    overflow: hidden;

    *[role='presentation'] {
      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      }
    }

    *[role='menuitem'] {
      display: flex;
      align-items: center;
      padding: 10px;
      color: var(--color-white);

      font-size: 14px;
      line-height: 16px;

      small {
        font-size: 8px;
      }

      img {
        margin-right: 8px;
        width: 20px;
      }

      span {
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &:hover {
        background-color: var(--color-red);
        color: var(--color-white);
      }
    }
  }
`

const Address = styled.div`
  padding: 6px;
  border-radius: 14px;
  background: var(--color-blue);
  color: var(--color-white);

  font-size: 12px;
  line-height: 15px;

  &.active {
    background: var(--color-red);
  }

  img {
    margin: 0 6px;
  }
`

const AdminAddress = styled.div`
  padding: 6px;
  background: #dfdede;
  color: var(--color-black);
  font-size: 12px;
  line-height: 15px;
  border: 2px solid var(--color-black);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

  img {
    margin: 0 6px;
  }
`

let web3Modal

const providerOptions = (network) => ({
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuras[network],
    },
  },
})

class Account extends Component {
  state = {
    network: networks[0],
    balanceTimer: 0,
  }

  async componentDidMount() {
    let session = {
      network: networks[0],
    }
    this.setState(
      {
        session,
        balanceTimer: setInterval(() => this.getBalance(), 10 * 1000),
      },
      () => {
        this.setWeb3Modal(session.network)
        this.connectWallet()
      }
    )
  }

  componentWillUnmount() {
    if (this.state.balanceTimer) clearTimeout(this.state.balanceTimer)
    if (this.props.library) this.props.library.onDisconnect()
  }

  setWeb3Modal(network) {
    if (web3Modal) {
      web3Modal.clearCachedProvider()
    }
    web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: providerOptions(network),
      disableInjectedProvider: false,
    })
  }

  connectWallet() {
    web3Modal
      .connect()
      .then((provider) => {
        this.initLibrary(provider)
      })
      .catch(console.log)
  }

  initLibrary(provider) {
    if (this.props.library) {
      this.props.library.setProvider(provider, addresses[this.state.network])
      setTimeout(() => this.getBalance(), 2.5 * 1000)
    } else {
      const { dispatch } = this.props
      let hook = null
      const handleEvent = (event) => {
        switch (event.event) {
          case 'Staked':
          case 'Unstaked':
          case 'RewardClaimed':
            dispatch({
              type: event.event.toUpperCase(),
              payload: {
                [event.transactionHash]: event.returnValues,
              },
            })
            break
          case 'WALLET':
            if (event.status === 3) {
              dispatch({
                type: 'DISCONNECT',
              })
            } else {
              if (event.status !== 0) {
                ;(this.props.library || hook).setProvider(provider, addresses[event.data.network])
              }
              dispatch({
                type: 'METAMASK',
                payload: event.data,
              })
            }
            break
          default:
            break
        }
      }
      const library = new Library.Farming(provider, {
        onEvent: handleEvent,
        addresses: addresses[this.state.network],
      })
      hook = library
      const handleAuctionEvent = (event) => {
        switch (event.event) {
          default:
            break
        }
      }
      if (process.env.AUCTION_ENABLED) {
        const auctions = Library.Auctions(provider, {
          onEvent: handleAuctionEvent,
          addresses: auctionAddresses[this.state.network],
        })
        dispatch({
          type: 'INIT_CONTRACTS',
          payload: [library, auctions],
        })
      } else {
        dispatch({
          type: 'INIT_CONTRACTS',
          payload: [library],
        })
      }
      setTimeout(() => this.getBalance(), 2.5 * 1000)
    }
  }

  saveMetamask({ state, ...updates }, callback) {
    const { dispatch, metamask } = this.props
    dispatch({
      type: 'METAMASK',
      payload: { ...metamask, ...updates },
    })
    if (state) this.setState(state)
    callback && callback()
  }

  getBalance() {
    const { metamask, library } = this.props
    const { address, network, balance: origin, connected } = metamask
    const isSupported = !network || isSupportedNetwork(network)

    if (!isSupported) return
    if (address && connected) {
      const resolvePromise = (promise, value = '0') =>
        new Promise((resolve) => promise.then(resolve).catch(() => resolve(value)))
      Promise.all([
        library.web3.eth.getBalance(address),
        library.methods.web3.getBlock(),
        Promise.all(tokens.map((token) => resolvePromise(library.methods[token].getBalance(address)))),
        Promise.all(uniV2s.map((token) => resolvePromise(library.methods[token].getBalance(address)))),
        Promise.all(
          uniV2s.map((token) =>
            Promise.all(
              uniV2Pools[token].map((pool) =>
                resolvePromise(library.methods[token].getAllowance(address, library.addresses[pool]))
              )
            )
          )
        ),
        Promise.all(uniV2s.map((token) => resolvePromise(library.methods[token].totalSupply()))),
        Promise.all(pools.map((token) => resolvePromise(library.methods[token].getBalance(address)))),
        Promise.all(pools.map((token) => resolvePromise(library.methods[token].getEarned(address)))),
        Promise.all(pools.map((token) => resolvePromise(library.methods[token].totalSupply()))),
        Promise.all(pools.map((token) => resolvePromise(library.methods[token].currentEpoch()))),
        Promise.all(pools.map((token) => resolvePromise(library.methods[token].lastEpochStaked(address)))),
        metamask.poolEpochPeriods
          ? Promise.resolve()
          : Promise.all(pools.map((token) => resolvePromise(library.methods[token].EPOCH_PERIOD(), '28800'))),
        metamask.poolHeartBeatTimes
          ? Promise.resolve()
          : Promise.all(
              pools.map((token) => resolvePromise(library.methods[token].HEART_BEAT_START_TIME(), '1607212800'))
            ),
      ])
        .then(
          ([
            _balance,
            latestBlockTimestamp,
            _tokenBalances,
            _uniV2Balances,
            _uniV2Allowances,
            _uniV2Supplies,
            _poolBalances,
            _poolEarnings,
            _poolSupplies,
            _poolEpochs,
            _poolLastEpochs,
            _poolEpochPeriods,
            _poolHeartBeatTimes,
          ]) => {
            function toNumber(value, decimal = 12) {
              const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`)
              const val = Number(value.toString().match(regex)[0])
              return val < 0.1 ** Math.max(decimal - 5, 2) ? 0 : val
            }
            const balance = toNumber(library.web3.utils.fromWei(_balance))
            const tokenBalances = _tokenBalances
              .map((val) => library.web3.utils.fromWei(val))
              .map((val) => toNumber(val))
            const uniV2Balances = _uniV2Balances
              .map((val) => library.web3.utils.fromWei(val))
              .map((val) => toNumber(val))
            const uniV2Allowances = _uniV2Allowances
              .reduce((a, c) => [...a, ...c], [])
              .map((val) => library.web3.utils.fromWei(val))
              .map((val) => toNumber(val))
            const uniV2Supplies = _uniV2Supplies
              .map((val) => library.web3.utils.fromWei(val))
              .map((val) => toNumber(val))
            const poolBalances = _poolBalances.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
            const poolEarnings = _poolEarnings.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
            const poolSupplies = _poolSupplies.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
            const poolEpochs = _poolEpochs.map(Number)
            const poolLastEpochs = _poolLastEpochs.map(Number)
            const poolEpochPeriods = metamask.poolEpochPeriods || _poolEpochPeriods.map(Number)
            const poolHeartBeatTimes = metamask.poolHeartBeatTimes || _poolHeartBeatTimes.map(Number)

            const findSome = (val, key) => val.some((item) => item !== metamask[key])

            if (
              origin !== balance ||
              metamask.latestBlockTimestamp !== latestBlockTimestamp ||
              findSome(tokenBalances, 'tokenBalances') ||
              findSome(uniV2Balances, 'uniV2Balances') ||
              findSome(uniV2Allowances, 'uniV2Allowances') ||
              findSome(uniV2Supplies, 'uniV2Supplies') ||
              findSome(poolBalances, 'poolBalances') ||
              findSome(poolEarnings, 'poolEarnings') ||
              findSome(poolSupplies, 'poolSupplies') ||
              findSome(poolEpochs, 'poolEpochs') ||
              findSome(poolLastEpochs, 'poolLastEpochs')
            )
              this.saveMetamask({
                balance,
                latestBlockTimestamp,
                tokenBalances,
                uniV2Balances,
                uniV2Allowances,
                uniV2Supplies,
                poolBalances,
                poolEarnings,
                poolSupplies,
                poolEpochs,
                poolLastEpochs,
                poolEpochPeriods,
                poolHeartBeatTimes,
              })
          }
        )
        .catch(console.log)
    }
  }

  render() {
    const { metamask, isAdmin } = this.props
    const isSupported = !metamask.network || isSupportedNetwork(metamask.network)
    const { address, balance, tokenBalances = [], uniV2Balances = [] } = metamask

    return (
      <Wrapper className="account">
        {isSupported ? (
          address ? (
            <Balances className={`flex${isAdmin ? ' admin' : ''}`}>
              {!isAdmin && (
                <>
                  {tokens.map((token, index) => (
                    <div className="balance-item flex" key={token}>
                      <img src={`/assets/${token.toLowerCase()}-token.svg`} alt={token} />
                      {(tokenBalances[index] || 0).toFixed(2)}
                    </div>
                  ))}
                </>
              )}
              <Dropdown>
                <Dropdown.Toggle
                  btnStyle="flat"
                  btnSize="sm"
                  noCaret
                  componentClass={({ className, children, ...props }) => {
                    const expanded = props['aria-expanded']
                    return isAdmin ? (
                      <AdminAddress
                        className={`flex-center cursor ${className} ${expanded ? 'active' : 'inactive'}`}
                        {...props}
                      >
                        <img src="/assets/metamask.svg" alt="MetaMask" />
                        {children}
                        <img src={`/assets/arrow${expanded ? '-up' : '-down'}.svg`} alt="MetaMask" />
                      </AdminAddress>
                    ) : (
                      <Address
                        className={`flex-center cursor ${className} ${expanded ? 'active' : 'inactive'}`}
                        {...props}
                      >
                        <img src="/assets/metamask.svg" alt="MetaMask" />
                        {children}
                        <img src={`/assets/arrow${expanded ? '-up' : '-down'}.svg`} alt="MetaMask" />
                      </Address>
                    )
                  }}
                >
                  {shorten(address)}{' '}
                  {metamask.network && metamask.network !== 1 ? `(${networkLabel(metamask.network)})` : ''}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {tokens.map((token, index) => (
                    <MenuItem eventKey={index + 1} key={token} className="mobile">
                      <img src={`/assets/${token.toLowerCase()}-token.svg`} alt={token} />
                      <span>
                        <small>{token}</small>
                        <br />
                        {tokenBalances[index] || 0}
                      </span>
                    </MenuItem>
                  ))}
                  <MenuItem eventKey={10}>
                    <img src={`/assets/eth.svg`} alt="ETH" />
                    <span>
                      <small>ETH</small>
                      <br />
                      {balance || 0}
                    </span>
                  </MenuItem>
                  {uniV2s.map((token, index) => (
                    <MenuItem eventKey={index + 1} key={token}>
                      <img src={`/assets/lst-eth-uni.svg`} alt={token} />
                      <span>
                        <small>{uniV2Labels[index]}</small>
                        <br />
                        {uniV2Balances[index] || 0}
                      </span>
                    </MenuItem>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Balances>
          ) : (
            <button className="connect blue" onClick={() => this.connectWallet()}>
              Connect Wallet
            </button>
          )
        ) : (
          <div />
        )}
      </Wrapper>
    )
  }
}

export default connect((state) => state)(Account)
