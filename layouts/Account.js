import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import { shorten } from 'utils/string'
import { networkLabel } from 'utils/etherscan'
import { tokens, uniV2s, uniV2Labels, pools } from './constants'
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

export const resolvePromise = (promise, value = '0') =>
  new Promise((resolve) => promise.then(resolve).catch(() => resolve(value)))

export default connect((state) => state)(function Account(props) {
  const token = pools[0]
  const { account = {}, wallet, info = {}, farming, dispatch, isAdmin, onConnect } = props
  const [timer, setTimer] = useState(0)
  const { address, network, balance } = account
  const { tokenBalances = [], uniV2Balances = [] } = info

  useEffect(() => {
    setTimer(setInterval(() => getBalance(), 15 * 1000))
    return () => timer && clearInterval(timer)
  }, [])
  useEffect(() => {
    getBalance()
  }, [address, network])

  const getBalance = () => {
    if (!wallet) return
    Promise.all([
      wallet.fetchAccount(),
      wallet.getBlock(),
      Promise.all(
        tokens.map((token) =>
          address ? resolvePromise(farming.methods[token].getBalance(address)) : Promise.resolve('0')
        )
      ),
      Promise.all(
        uniV2s.map((token) =>
          address ? resolvePromise(farming.methods[token].getBalance(address)) : Promise.resolve('0')
        )
      ),
      resolvePromise(farming.methods[token].currentEpoch()),
      info.poolEpochPeriod
        ? Promise.resolve(info.poolEpochPeriod)
        : resolvePromise(farming.methods[token].EPOCH_PERIOD(), '28800'),
      info.poolHeartBeatTime
        ? Promise.resolve(info.poolHeartBeatTime)
        : resolvePromise(farming.methods[token].HEART_BEAT_START_TIME(), '1607212800'),
    ])
      .then(
        ([
          ,
          latestBlockTimestamp,
          _tokenBalances,
          _uniV2Balances,
          _poolEpoch,
          _poolEpochPeriod,
          _poolHeartBeatTime,
        ]) => {
          function toNumber(value, decimal = 12) {
            const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`)
            const val = Number(value.toString().match(regex)[0])
            return val < 0.1 ** Math.max(decimal - 5, 2) ? 0 : val
          }
          const tokenBalances = _tokenBalances.map((val) => wallet.fromWei(val)).map((val) => toNumber(val))
          const uniV2Balances = _uniV2Balances.map((val) => wallet.fromWei(val)).map((val) => toNumber(val))
          const poolEpoch = Number(_poolEpoch)
          const poolEpochPeriod = Number(_poolEpochPeriod)
          const poolHeartBeatTime = Number(_poolHeartBeatTime)
          const findSome = (val, key) => val.some((item) => item !== info[key])
          if (
            info.latestBlockTimestamp !== latestBlockTimestamp ||
            findSome(tokenBalances, 'tokenBalances') ||
            findSome(uniV2Balances, 'uniV2Balances') ||
            info.poolEpoch !== poolEpoch
          ) {
            dispatch({
              type: 'INFO',
              payload: {
                latestBlockTimestamp,
                tokenBalances,
                uniV2Balances,
                poolEpoch,
                poolEpochPeriod,
                poolHeartBeatTime,
              },
            })
          }
        }
      )
      .catch(console.log)
  }

  return (
    <Wrapper className="account">
      {address ? (
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
                    <img src="/assets/metamask.svg" alt="metamask" />
                    {children}
                    <img src={`/assets/arrow${expanded ? '-up' : '-down'}.svg`} alt="wallet" />
                  </AdminAddress>
                ) : (
                  <Address className={`flex-center cursor ${className} ${expanded ? 'active' : 'inactive'}`} {...props}>
                    <img src="/assets/metamask.svg" alt="metamask" />
                    {children}
                    <img src={`/assets/arrow${expanded ? '-up' : '-down'}.svg`} alt="wallet" />
                  </Address>
                )
              }}
            >
              {shorten(address)} {network && network !== 1 ? `(${networkLabel(network)})` : ''}
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
        <button className="connect blue" onClick={() => onConnect()}>
          Connect Wallet
        </button>
      )}
    </Wrapper>
  )
})
