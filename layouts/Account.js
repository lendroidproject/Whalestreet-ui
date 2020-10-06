import { Component } from 'react'
import styled from 'styled-components'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import Web3 from 'web3'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import Library from 'library'

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

const Balances = styled.div``

class Account extends Component {
  state = {
    address: '',
    balance: '',
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
      const { address } = this.state
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
    }, 1 * 1000)
    const balanceTimer = setInterval(() => {
      const { address } = this.state
      if (address !== ethereum.selectedAddress) {
        return this.saveMetamask({ address: ethereum.selectedAddress }, () => this.getBalance())
      }
      this.getBalance()
    }, 15 * 1000)
    this.saveMetamask({ address: ethereum.selectedAddress, balanceTimer, addressTimer }, () => this.getBalance())

    const { dispatch } = this.props
    const handleEvent = (event) => {
      console.info(event)
      switch (event.event) {
        case 'PayoutCreated':
          dispatch({
            type: 'PAYOUT_CREATED',
            payload: {
              [event.transactionHash]: event.returnValues.payoutAddress,
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

  saveMetamask(metamask, callback) {
    console.log(metamask)
    const { dispatch } = this.props
    dispatch({
      type: 'METAMASK',
      payload: metamask,
    })
    this.setState(metamask, callback)
  }

  getBalance() {
    const { address, balance: origin } = this.state
    if (address) {
      window.web3.eth
        .getBalance(address)
        .then((res) => {
          const balance = Number(web3.utils.fromWei(res))
          if (origin !== balance) this.saveMetamask({ balance })
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
            {metamask.address}
            <Dropdown onSelect={(eventKey) => {}}>
              <Dropdown.Toggle btnStyle="flat">Toggler</Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem header>Header</MenuItem>
                <MenuItem eventKey={1}>link</MenuItem>
                <MenuItem divider />
                <MenuItem header>Header</MenuItem>
                <MenuItem eventKey={2}>link</MenuItem>
                <MenuItem eventKey={3} disabled>
                  disabled
                </MenuItem>
                <MenuItem eventKey={4} title="link with title">
                  link with title
                </MenuItem>
                <MenuItem
                  eventKey={5}
                  active
                  onSelect={(eventKey) => {
                    alert(`Alert from menu item.\neventKey: ${eventKey}`)
                  }}
                >
                  link that alerts
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
