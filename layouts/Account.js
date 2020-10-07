import { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import Web3 from 'web3'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import Library from 'library'
import { shorten } from 'utils/string'

const Wrapper = styled.div`
  .connect {
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;

    border: 1px solid var(--color-black);
    border-radius: 14px;
    background-color: var(--color-black);
    color: var(--color-white);
    padding: 6px 15px;
  }
`

const Balances = styled.div`
  width: 188px;

  *[role='menu'] {
    border-radius: 0 0 4px 4px;
    background-color: #f1f1f1;
    border: 0;
    box-shadow: none;
    width: 100%;
    padding: 0;

    *[role='menuitem'] {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid var(--color-white);

      font-size: 14px;
      line-height: 16px;

      small {
        font-size: 8px;
      }

      img {
        margin-right: 8px;
      }
    }
  }
`

const Address = styled.div`
  padding: 4px;
  border-radius: 4px 4px 0 0;

  font-size: 12px;
  font-weight: 500;
  line-height: 15px;

  &.active {
    background: var(--color-black);
    color: var(--color-white);
  }

  img {
    margin: 0 4px;
  }
`
const Balance = styled.div`
  color: red;
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
      console.info(event)
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
        library ? library.methods.LSTETHPool.getRewards(suggest || address) : Promise.resolve('0'),
      ])
        .then(([balance1, balance2, allowance2, balance3, rewards3]) => {
          const balance = Number(web3.utils.fromWei(balance1))
          const LSTWETHUNIV2 = Number(web3.utils.fromWei(balance2))
          const aLSTWETHUNIV2 = Number(web3.utils.fromWei(allowance2))
          const LSTETHPool = Number(web3.utils.fromWei(balance3))
          const rLSTETHPool = Number(web3.utils.fromWei(rewards3))
          if (
            origin !== balance ||
            metamask.LSTWETHUNIV2 !== LSTWETHUNIV2 ||
            metamask.aLSTWETHUNIV2 !== aLSTWETHUNIV2 ||
            metamask.LSTETHPool !== LSTETHPool ||
            metamask.rLSTETHPool !== rLSTETHPool
          )
            this.saveMetamask({ balance, LSTWETHUNIV2, aLSTWETHUNIV2, LSTETHPool, rLSTETHPool })
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
                      <img src={`/assets/wallet${expanded ? '-hover' : ''}.svg`} alt="MetaMask" />
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
                  <img src={`/assets/balance-uni-eth-lst.svg`} alt="LST-ETH-UNI-V2" />
                  <span>
                    <small>LST-ETH-UNI-V2</small>
                    <br />
                    {metamask.LSTWETHUNIV2 || 0}
                  </span>
                </MenuItem>
                {/* <MenuItem eventKey={2}>
                  <img src={`/assets/balance-uni-eth-shrimp.svg`} alt="LST-$hrimp-UNI-V2" />
                  <span>
                    <small>LST-$hrimp-UNI-V2</small>
                    <br />
                    464
                  </span>
                </MenuItem> */}
                <MenuItem eventKey={3}>
                  <img src={`/assets/balance-eth.svg`} alt="ETH" />
                  <span>
                    <small>ETH</small>
                    <br />
                    {metamask.balance || 0}
                  </span>
                </MenuItem>
                <MenuItem eventKey={3}>
                  <img src={`/assets/balance-uni.svg`} alt="UNI" />
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
          <button className="connect" onClick={() => this.initMetamask()}>
            Connect Wallet
          </button>
        )}
      </Wrapper>
    )
  }
}

export default connect((state) => state)(withRouter(Account))
