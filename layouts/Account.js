import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import Library from 'whalestreet-js'
import { shorten } from 'utils/string'
import { isSupportedNetwork, networkLabel } from 'utils/etherscan'

const addresses = {
  1: {
    $HRIMP: '0x9077F9e1eFE0eA72867ac89046b2a6264CbcaeF5',
    LST_WETH_UNI_V2: '0x9D23cb25aD23D73E0a723a47b146139D46Ab5F91',
    LSTETHPool: '0xF34976159AdAe214E293Cf03D12d20EADE658A8C',
    LST: '0x4de2573e27E648607B50e1Cfff921A33E4A34405',
  },
  42: {
    $HRIMP: '0xaDb74ae0A618c0b7474B9f2e7B7CcecCF72f9676',
    LST_WETH_UNI_V2: '0x606B69Cd303B9E718AA57d4e7bcc8D332Fa6D024',
    LSTETHPool: '0x87f80C03d0950E12c5b33E700A2c302a3036E3C8',
    LST: '0x4de2573e27E648607B50e1Cfff921A33E4A34405',
  },
}

// const auctionAddresses = {
//   1: {},
//   42: {
//     $HRIMP: '0xaDb74ae0A618c0b7474B9f2e7B7CcecCF72f9676',
//     AuctionRegistry: '0xB06b995A40f7752581ec92CBf106872a3B96590B',
//     WhaleSwap: '0x9142aF7F6F769f95edDDa4851F22859319090987',
//   },
// }

const Wrapper = styled.div`
  @media all and (min-width: 578px) {
    position: absolute;
    right: 65px;
    top: 58px;
  }

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
    @media all and (max-width: 577px) {
      display: none;
    }
  }

  *[role='menu'] {
    border-radius: 0 0 4px 4px;
    background-color: var(--color-blue);
    border: 0;
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
        border-bottom: 1px solid var(--color-white);
      }

      @media all and (min-width: 577px) {
        &.mobile {
          display: none;
        }
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

class Account extends Component {
  state = {
    networkTimer: null,
    addressTimer: null,
    balanceTimer: null,
  }

  async componentDidMount() {
    this.connectMetamask()
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    const { networkTimer, addressTimer, balanceTimer } = this.state
    if (networkTimer) clearInterval(networkTimer)
    if (addressTimer) clearInterval(addressTimer)
    if (balanceTimer) clearInterval(balanceTimer)
  }

  async connectMetamask() {
    if (window.ethereum) {
      if (window.ethereum._metamask.isEnabled() && (await window.ethereum._metamask.isUnlocked())) {
        this.initMetamask()
      } else {
        window.ethereum
          .enable()
          .then(() => this.initMetamask())
          .catch(console.log)
      }
    }
  }

  initMetamask() {
    this.clearTimer()

    const networkTimer = setInterval(() => {
      const { network } = this.props.metamask
      if (network && network !== window.ethereum.networkVersion) {
        return this.saveMetamask(
          {
            network: window.ethereum.networkVersion,
          },
          () => this.initMetamask()
        )
      }
    }, 1 * 1000)

    if (!isSupportedNetwork(window.ethereum.networkVersion)) {
      return this.setState({ networkTimer }, () =>
        this.saveMetamask({
          network: window.ethereum.networkVersion,
        })
      )
    }

    const addressTimer = setInterval(() => {
      const { address } = this.props.metamask
      if (address !== window.ethereum.selectedAddress) {
        return this.saveMetamask(
          {
            address: window.ethereum.selectedAddress,
          },
          () => this.getBalance()
        )
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(() => {
      const { address } = this.props.metamask
      if (address !== window.ethereum.selectedAddress) {
        return this.saveMetamask({ address: window.ethereum.selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 5 * 1000)

    this.saveMetamask(
      {
        address: window.ethereum.selectedAddress,
        network: window.ethereum.networkVersion,
        state: { balanceTimer, addressTimer, networkTimer },
      },
      () => this.getBalance(window.ethereum.selectedAddress)
    )

    const { dispatch } = this.props
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
        default:
          console.info(event)
          break
      }
    }
    const library = Library.Farming(window.ethereum, {
      onEvent: handleEvent,
      addresses: addresses[window.ethereum.networkVersion],
    })
    // const auctions = Library.Auctions(window.ethereum, {
    //   onEvent: handleEvent,
    //   addresses: auctionAddresses[window.ethereum.networkVersion],
    // })
    dispatch({
      type: 'INIT_CONTRACTS',
      payload: [
        library,
        // auctions,
      ],
    })
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

  getBalance(suggest) {
    const { metamask, library, auctions } = this.props
    const { address, balance: origin } = metamask

    if (library && (suggest || address)) {
      Promise.all([
        library.web3.eth.getBalance(suggest || address),
        library.methods.LSTWETHUNIV2.getBalance(suggest || address),
        library.methods.LSTWETHUNIV2.getAllowance(suggest || address),
        library.methods.LSTETHPool.getBalance(suggest || address),
        library.methods.LSTETHPool.totalSupply(),
        library.methods.LSTETHPool.getEarned(suggest || address),
        library.methods.$HRIMP.getBalance(suggest || address),
        library.methods.$HRIMP.totalSupply(),
        // auctions.methods.$HRIMP.getAllowance(suggest || address),
        new Promise((resolve) =>
          library.methods.LST.getBalance(suggest || address)
            .then(resolve)
            .catch(() => resolve('0'))
        ),
        library.methods.web3.getBlock(),
        library.methods.LSTETHPool.currentEpoch(),
        new Promise((resolve) =>
          library.methods.LSTETHPool.EPOCH_PERIOD()
            .then(resolve)
            .catch(() => resolve('28800'))
        ),
        new Promise((resolve) =>
          library.methods.LSTETHPool.HEART_BEAT_START_TIME()
            .then(resolve)
            .catch(() => resolve('1607212800'))
        ),
      ])
        .then(
          ([
            balance1,
            balance2,
            allowance2,
            balance3,
            supply3,
            earned3,
            balance4,
            supply4,
            // allowance4,
            balance5,
            latestBlockTimestamp,
            currentEpoch,
            epochPeriod,
            heartBeatTime,
          ]) => {
            function toNumber(value, decimal = 12) {
              const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`)
              return Number(value.toString().match(regex)[0])
            }
            const balance = toNumber(library.web3.utils.fromWei(balance1))
            const LSTWETHUNIV2 = toNumber(library.web3.utils.fromWei(balance2))
            const aLSTWETHUNIV2 = toNumber(library.web3.utils.fromWei(allowance2))
            const LSTETHPool = toNumber(library.web3.utils.fromWei(balance3))
            const sLSTETHPool = toNumber(library.web3.utils.fromWei(supply3))
            const eLSTETHPool = toNumber(library.web3.utils.fromWei(earned3))
            const $HRIMP = toNumber(library.web3.utils.fromWei(balance4))
            const s$HRIMP = toNumber(library.web3.utils.fromWei(supply4))
            // const a$HRIMP = toNumber(library.web3.utils.fromWei(allowance4))
            const LST = toNumber(library.web3.utils.fromWei(balance5))
            if (
              origin !== balance ||
              metamask.LSTWETHUNIV2 !== LSTWETHUNIV2 ||
              metamask.aLSTWETHUNIV2 !== aLSTWETHUNIV2 ||
              metamask.LSTETHPool !== LSTETHPool ||
              metamask.sLSTETHPool !== sLSTETHPool ||
              metamask.eLSTETHPool !== eLSTETHPool ||
              metamask.$HRIMP !== $HRIMP ||
              metamask.s$HRIMP !== s$HRIMP ||
              // metamask.a$HRIMP !== a$HRIMP ||
              metamask.LST !== LST ||
              metamask.latestBlockTimestamp !== latestBlockTimestamp ||
              metamask.currentEpoch !== currentEpoch
            )
              this.saveMetamask({
                balance,
                LSTWETHUNIV2,
                aLSTWETHUNIV2,
                LSTETHPool,
                sLSTETHPool,
                eLSTETHPool,
                $HRIMP,
                s$HRIMP,
                // a$HRIMP,
                LST,
                latestBlockTimestamp,
                currentEpoch,
                epochPeriod: Number(epochPeriod),
                heartBeatTime: Number(heartBeatTime),
              })
          }
        )
        .catch(console.log)
    }
  }

  render() {
    const { metamask } = this.props
    const isSupported = !metamask.network || isSupportedNetwork(metamask.network)

    return (
      <Wrapper className="account">
        {isSupported ? (
          metamask.address ? (
            <Balances className="flex">
              <div className="balance-item flex">
                <img src="/assets/$hrimp-token.svg" alt="$HRIMP" />
                {(metamask.$HRIMP || 0).toFixed(2)}
              </div>
              <div className="balance-item flex">
                <img src="/assets/lst-token.svg" alt="LST" />
                {(metamask.LST || 0).toFixed(2)}
              </div>
              <Dropdown
                onSelect={(eventKey) => {
                  console.log(eventKey)
                }}
              >
                <Dropdown.Toggle
                  btnStyle="flat"
                  btnSize="sm"
                  noCaret
                  componentClass={({ className, children, ...props }) => {
                    const expanded = props['aria-expanded']
                    return (
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
                  {shorten(metamask.address)}{' '}
                  {metamask.network && metamask.network !== '1' ? `(${networkLabel(metamask.network)})` : ''}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey={1}>
                    <img src={`/assets/lst-eth-uni.svg`} alt="LST-ETH-UNI-V2" />
                    <span>
                      <small>LST-ETH-UNI-V2</small>
                      <br />
                      {metamask.LSTWETHUNIV2 || 0}
                    </span>
                  </MenuItem>
                  <MenuItem eventKey={2} className="mobile">
                    <img src={`/assets/$hrimp-token.svg`} alt="$HRIMP" />
                    <span>
                      <small>$HRIMP</small>
                      <br />
                      {(metamask.$HRIMP || 0).toFixed(2)}
                    </span>
                  </MenuItem>
                  <MenuItem eventKey={3}>
                    <img src={`/assets/eth.svg`} alt="ETH" />
                    <span>
                      <small>ETH</small>
                      <br />
                      {metamask.balance || 0}
                    </span>
                  </MenuItem>
                  <MenuItem eventKey={4} className="mobile">
                    <img src={`/assets/lst-token.svg`} alt="LST" />
                    <span>
                      <small>LST</small>
                      <br />
                      {(metamask.LST || 0).toFixed(2)}
                    </span>
                  </MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </Balances>
          ) : (
            <button className="connect blue" onClick={() => this.connectMetamask()}>
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
