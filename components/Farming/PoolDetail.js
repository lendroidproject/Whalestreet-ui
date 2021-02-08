import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { uniV2s, pools, uniV2PoolList } from 'layouts/constants'
import { getDuration, useTicker } from 'utils/hooks'
import MaxInput from 'components/common/MaxInput'
import TxModal from 'components/common/TxModal'

import { Wrapper as PoolWrapper, PoolIcon } from './Pool'

const Wrapper = styled(PoolWrapper)`
  width: 654px;
  margin-top: 50px;
  position: relative;
  padding-top: 0;
  @media all and (max-width: 577px) {
    margin-top: 50px;
  }

  h2 {
    padding: 15px;
    width: 100%;
    margin: 0;
    // border-bottom: 1px solid var(--color-light-blue);
    @media all and (max-width: 577px) {
      padding: 0 0 10px;
      font-size: 16px;
      line-height: 24px;
    }

    + div {
      padding: 16px 16px 24px;
      @media all and (max-width: 577px) {
        padding: 16px 0 0;
      }
    }
  }

  > button {
    padding: 0;
    width: auto;
    border-radius: 0;
    border: 0;

    position: absolute;
    left: 0;
    top: -50px;
    @media all and (max-width: 577px) {
      left: calc(50% - 38px);
      font-size: 20px;
    }

    img {
      margin-right: 9px;
    }
  }
`

const PoolDetailIcon = styled(PoolIcon)`
  padding: 0;
  margin-right: 12px;
`

const Detail = styled.div`
  text-align: left;
  width: 100%;
  @media all and (max-width: 577px) {
    flex-direction: column;
    text-align: center;
  }

  label + p {
    margin-top: 12px;
    @media all and (max-width: 577px) {
      margin-top: 4px;
      margin-bottom: 20px;
    }
  }

  .note {
    margin-top: 29px;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    margin-bottom: 0;
  }

  .actions {
    margin: 29px -5px -5px;
    @media all and (max-width: 577px) {
      margin: 24px 0 0;
    }

    button {
      border-radius: 10px;

      display: flex;
      align-items: center;
      margin: 5px;
      padding: 8px 12px;
      @media all and (max-width: 577px) {
        margin: 0 5px;
        padding: 8px 10px;
        justify-content: center;
      }

      img {
        margin-right: 8px;
        width: 30px;
        height: 30px;
        @media all and (max-width: 577px) {
          width: 20px;
          height: 20px;
        }
      }

      .duration {
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translateX(-50%);
        font-size: 60%;

        text-transform: none;
        white-space: nowrap;
      }
    }
  }

  .claim p {
    max-width: 220px;
    width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .stake {
    width: 60%;
  }
  .claim {
    width: 40%;
  }
  @media all and (max-width: 577px) {
    > .flex {
      flex-direction: column;

      .stake,
      .claim {
        width: 100%;
        margin: auto;

        p {
          width: 100%;
          max-width: 100%;
        }
      }

      .actions {
        max-width: 247px;
        margin-left: auto;
        margin-right: auto;
      }

      .stake .actions {
        margin-top: 0;

        &:not(.justify-center) {
          justify-content: space-between;
        }
      }

      .claim button {
        width: 100%;
      }
    }

    .detail-actions {
      margin-bottom: 15px;
    }
  }
`

const Stake = styled.div`
  width: 100%;
  @media all and (max-width: 577px) {
    .flex {
      flex-direction: column;
    }
  }

  .input {
    text-align: left;
    max-width: 300px;
    margin: auto;
    width: 100%;

    label + p {
      margin-top: 12px;
      margin-bottom: 0;
      @media all and (max-width: 577px) {
        font-size: 20px;
        line-height: 29px;
        margin-top: 4px;
        margin-bottom: 25px;
      }
    }

    input {
      @media all and (max-width: 577px) {
        font-size: 20px;
        line-height: 29px;
      }
    }
  }

  p.label {
    text-align: left;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 20px;
    margin-top: 15px;
    margin-bottom: 0;
  }

  > button {
    padding: 10px 50px;
    border-radius: 7px;
    margin-top: 35px;
    @media all and (max-width: 577px) {
      padding: 8px 50px;
      margin-top: 21px;
      margin-bottom: 8px;
    }
  }
`

const Unstake = styled(Stake)``

const Claim = styled(Stake)`
  .input {
    text-align: center;

    label + p {
      margin-bottom: 0;
    }
  }
`

function PoolDetail({
  base,
  pair,
  pool,
  uniV2,
  rewardBase,
  background,
  stake,
  metamask,
  library,
  transactions,
  dispatch,
  onBack,
}) {
  const uniIndex = uniV2s.findIndex((item) => item === uniV2)
  const poolIndex = pools.findIndex((item) => item === pool)
  const listIndex = uniV2PoolList.findIndex((item) => item === pool)
  const {
    address,
    latestBlockTimestamp,
    uniV2Balances = [],
    uniV2Allowances = [],
    poolBalances = [],
    poolEarnings = [],
    poolEpochs = [],
    poolLastEpochs = [],
  } = metamask
  const currentEpoch = poolEpochs[poolIndex] || 0
  const lastEpochStaked = poolLastEpochs[poolIndex] || 0
  const uniV2Balance = uniV2Balances[uniIndex] || 0
  const uniV2Allowance = uniV2Allowances[listIndex] || 0
  const poolBalance = poolBalances[poolIndex] || 0
  const poolEarning = poolEarnings[poolIndex] || 0

  const [stakeForm, setStakeForm] = useState({ amount: 0 })
  const [approveTx, setApproveTx] = useState(null)
  const [stakeTx, setStakeTx] = useState(null)
  const [unstakeForm, setUnstakeForm] = useState({ amount: 0 })
  const [unstakeTx, setUnstakeTx] = useState(null)
  const [claimTx, setClaimTx] = useState(null)
  const [mode, setMode] = useState('')

  const unstakeDisabled = currentEpoch === lastEpochStaked
  const [[blockTimestamp, epochEndTime], setEpochEndTime] = useState([0, 0])
  const [now] = useTicker()
  const duration = getDuration(now, epochEndTime * 1000)

  const { epochEndTimeFromTimestamp } = library.methods[pool]
  useEffect(() => {
    if (latestBlockTimestamp && latestBlockTimestamp !== blockTimestamp) {
      epochEndTimeFromTimestamp(latestBlockTimestamp)
        .then((endTime) => {
          if (endTime !== epochEndTime) setEpochEndTime([latestBlockTimestamp, endTime])
        })
        .catch(console.log)
    }
  }, [latestBlockTimestamp])

  const pendingTx = approveTx || stakeTx || unstakeTx || claimTx
  const pendingText = stakeTx
    ? 'Depositing your stake'
    : unstakeTx
    ? 'Withdrawing your stake'
    : claimTx
    ? 'Claiming your rewards'
    : ''

  useEffect(() => {
    if (stakeTx && transactions[stakeTx]) {
      setStakeTx(null)
      if (mode === 'stake') setMode('')
    }
    if (unstakeTx && transactions[unstakeTx]) {
      setUnstakeTx(null)
      if (mode === 'unstake') setMode('')
    }
    if (claimTx && transactions[claimTx]) {
      setClaimTx(null)
      if (mode === 'claim') setMode('')
    }
  }, [transactions])

  const handleMode = (mode) => {
    mode === 'stake' && setStakeForm({ amount: 0 })
    mode === 'unstake' && setUnstakeForm({ amount: 0 })
    setMode(mode)
  }

  const handleApprove = () => {
    const { approve } = library.methods[uniV2]
    approve(library.addresses[pool], library.web3.utils.toWei((10 ** 8).toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setApproveTx(hash)
      })
      .on('receipt', function (receipt) {
        dispatch({
          type: 'METAMASK',
          payload: {
            uniV2Allowances: uniV2Allowances.map((item, index) =>
              listIndex === index
                ? Number(library.web3.utils.fromWei(receipt.events.Approval.returnValues.value))
                : item
            ),
          },
        })
        setApproveTx(null)
      })
      .on('error', (err) => {
        setApproveTx(null)
      })
  }

  const handleStake = () => {
    const { amount } = stakeForm
    const { stake } = library.methods[pool]
    stake(library.web3.utils.toWei(amount.toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setStakeTx(hash)
      })
      .on('receipt', function (receipt) {
        // setStakeTx(null)
      })
      .on('error', (err) => {
        setStakeTx(null)
      })
  }

  const handleUnstake = () => {
    const { amount } = unstakeForm
    const { unstake } = library.methods[pool]
    unstake(library.web3.utils.toWei(amount.toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setUnstakeTx(hash)
      })
      .on('receipt', function (receipt) {
        // setUnstakeTx(null)
      })
      .on('error', (err) => {
        setUnstakeTx(null)
      })
  }

  const handleClaim = () => {
    const { claim } = library.methods[pool]
    claim({ from: address })
      .send()
      .on('transactionHash', function (hash) {
        setClaimTx(hash)
      })
      .on('receipt', function (receipt) {
        // setClaimTx(null)
      })
      .on('error', (err) => {
        setClaimTx(null)
      })
  }

  return (
    <Wrapper
      className={`flex-center flex-column ${background ? `background-${background}` : ''}`}
      key={`${base}${pair}`}
      detail
    >
      <button className="white uppercase" onClick={() => (mode ? setMode('') : onBack())}>
        <img src="/assets/back.svg" alt="Go Back" />
        Back
      </button>
      <h2 className="flex-center justify-center">
        <PoolDetailIcon className="flex-center">
          <img src={`/assets/${base.toLowerCase()}-token.svg`} alt={base} />
          <img src={`/assets/${pair.toLowerCase()}-token.svg`} alt={pair} />
        </PoolDetailIcon>
        {base}/{pair} POOL
      </h2>
      {!mode && (
        <Detail>
          <div className="flex justify-around">
            {uniV2Allowance > uniV2Balance ? (
              <div className="stake">
                <label>{stake} Staked</label>
                <p>{poolBalance}</p>
              </div>
            ) : (
              <div className="stake">
                <label>{stake} Balance</label>
                <p>{uniV2Balance}</p>
              </div>
            )}
            <div className="claim">
              <label>Unclaimed {rewardBase} Tokens</label>
              <p>{poolEarning.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]}</p>
            </div>
          </div>
          <div className="flex justify-around detail-actions">
            {uniV2Allowance > uniV2Balance ? (
              <>
                <div className="stake">
                  <div className="actions flex">
                    <button className="uppercase red" onClick={() => handleMode('stake')} disabled={!uniV2Balance}>
                      <img src="/assets/stake.svg" alt="Stake" />
                      Stake
                    </button>
                    <button
                      className="uppercase red relative"
                      onClick={() => handleMode('unstake')}
                      disabled={!poolBalance || unstakeDisabled}
                    >
                      <img src="/assets/unstake.svg" alt="Unstake" />
                      Unstake
                      {duration && unstakeDisabled && <span className="duration">* next epoch in {duration}</span>}
                    </button>
                  </div>
                </div>
                <div className="claim">
                  <div className="actions flex justify-center">
                    <button className="uppercase red" onClick={() => handleMode('claim')} disabled={!poolEarning}>
                      <img src={`/assets/claim-${rewardBase.toLowerCase()}.svg`} alt="Claim" />
                      Claim {rewardBase}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="stake">
                <div className="actions flex justify-center">
                  <button
                    className="uppercase red"
                    onClick={() => handleApprove()}
                    disabled={!uniV2Balance || approveTx}
                  >
                    <img src="/assets/stake.svg" alt="Stake" />
                    Approve Pool
                  </button>
                </div>
              </div>
            )}
          </div>
          {uniV2Allowance > uniV2Balance && (
            <p className="note">
              {unstakeDisabled
                ? `* You recently staked in the current epoch. unstake will be enabled next epoch onward.`
                : `* Your last stake was in epoch ${lastEpochStaked}. Current epoch is ${currentEpoch}`}
            </p>
          )}
        </Detail>
      )}
      {mode === 'stake' && (
        <Stake>
          <div className="flex justify-around">
            <div className="input">
              <label>Balance</label>
              <p>{uniV2Balance}</p>
            </div>
            <MaxInput
              label="Amount to Stake"
              value={stakeForm.amount}
              min={0}
              onChange={(e) => setStakeForm({ amount: Math.min(e.target.value, uniV2Balance) })}
              onMax={() => setStakeForm({ amount: uniV2Balance })}
            />
          </div>
          <button className="uppercase red" disabled={!!stakeTx || stakeForm.amount === 0} onClick={handleStake}>
            Stake Now
          </button>
        </Stake>
      )}
      {mode === 'unstake' && (
        <Unstake>
          <div className="flex justify-around">
            <div className="input">
              <label>{stake} Staked</label>
              <p>{poolBalance}</p>
            </div>
            <MaxInput
              label="Amount Losable"
              value={unstakeForm.amount}
              min={0}
              onChange={(e) => setUnstakeForm({ amount: Math.min(e.target.value, poolBalance) })}
              onMax={() => setUnstakeForm({ amount: poolBalance })}
            />
          </div>
          <button className="uppercase red" disabled={!!unstakeTx || unstakeForm.amount === 0} onClick={handleUnstake}>
            Unstake Now
          </button>
        </Unstake>
      )}
      {mode === 'claim' && (
        <Claim>
          <div className="flex justify-around">
            <div className="input">
              <label>Unclaimed {rewardBase} Tokens</label>
              <p>{poolEarning}</p>
            </div>
          </div>
          <button className="uppercase red" disabled={!!claimTx || poolEarning === 0} onClick={handleClaim}>
            Claim Now
          </button>
        </Claim>
      )}
      <TxModal show={pendingTx} text={pendingText} />
    </Wrapper>
  )
}

export default connect(({ metamask, library, transactions }) => ({ metamask, library, transactions }))(PoolDetail)
