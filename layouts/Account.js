import { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import Web3 from 'web3'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import Library from 'library'
import { shorten } from 'utils/string'

const Wrapper = styled.div`
  position: absolute;
  right: 65px;
  top: 58px;

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
    addressTimer: null,
    balanceTimer: null,
  }

  async componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      if (ethereum._metamask.isEnabled() && (await ethereum._metamask.isUnlocked())) {
        this.initMetamask()
      } else {
        ethereum
          .enable()
          .then(() => this.initMetamask())
          .catch(console.log)
      }
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  clearTimer() {
    const { addressTimer, balanceTimer } = this.state
    if (addressTimer) clearInterval(addressTimer)
    if (balanceTimer) clearInterval(balanceTimer)
  }

  initMetamask() {
    this.clearTimer()
    const addressTimer = setInterval(() => {
      const { address } = this.props.metamask
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(() => {
      const { address } = this.props.metamask
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 5 * 1000)
    this.saveMetamask({ address: ethereum.selectedAddress, state: { balanceTimer, addressTimer } }, () =>
      this.getBalance(ethereum.selectedAddress)
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
    const library = Library(ethereum, {
      onEvent: handleEvent,
    })
    dispatch({
      type: 'INIT_CONTRACTS',
      payload: library,
    })
  }

  saveMetamask({ state, ...metamask }, callback) {
    const { dispatch } = this.props
    dispatch({
      type: 'METAMASK',
      payload: metamask,
    })
    if (state) this.setState(state)
    callback && callback()
  }

  getBalance(suggest) {
    const { metamask, library } = this.props
    const { address, balance: origin } = metamask
    if (suggest || address) {
      Promise.all([
        window.web3.eth.getBalance(suggest || address),
        library ? library.methods.LSTWETHUNIV2.getBalance(suggest || address) : Promise.resolve('0'),
        library ? library.methods.LSTWETHUNIV2.getAllowance(suggest || address) : Promise.resolve('0'),
        library ? library.methods.LSTETHPool.getBalance(suggest || address) : Promise.resolve('0'),
        library ? library.methods.LSTETHPool.getEarned(suggest || address) : Promise.resolve('0'),
      ])
        .then(([balance1, balance2, allowance2, balance3, earned3]) => {
          const balance = Number(web3.utils.fromWei(balance1))
          const LSTWETHUNIV2 = Number(web3.utils.fromWei(balance2))
          const aLSTWETHUNIV2 = Number(web3.utils.fromWei(allowance2))
          const LSTETHPool = Number(web3.utils.fromWei(balance3))
          const eLSTETHPool = Number(web3.utils.fromWei(earned3))
          if (
            origin !== balance ||
            metamask.LSTWETHUNIV2 !== LSTWETHUNIV2 ||
            metamask.aLSTWETHUNIV2 !== aLSTWETHUNIV2 ||
            metamask.LSTETHPool !== LSTETHPool ||
            metamask.eLSTETHPool !== eLSTETHPool
          )
            this.saveMetamask({ balance, LSTWETHUNIV2, aLSTWETHUNIV2, LSTETHPool, eLSTETHPool })
        })
        .catch(console.log)
    }
  }

  render() {
    const { metamask } = this.props
    return (
      <Wrapper>
        {metamask.address ? (
          <Balances>
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
                {shorten(metamask.address)}
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
                <MenuItem eventKey={2}>
                  <img src={`/assets/shrimp-eth-uni.svg`} alt="LST-$hrimp-UNI-V2" />
                  <span>
                    <small>$hrimp-ETH-UNI-V2</small>
                    <br />0
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
                <MenuItem eventKey={3}>
                  <img src={`/assets/uni.svg`} alt="UNI" />
                  <span>
                    <small>UNI</small>
                    <br />
                    1000
                  </span>
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </Balances>
        ) : (
          <button className="connect blue" onClick={() => this.initMetamask()}>
            Connect Wallet
          </button>
        )}
      </Wrapper>
    )
  }
}

export default connect((state) => state)(withRouter(Account))
