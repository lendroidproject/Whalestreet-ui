import Link from 'next/link'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import MaxInput from './common/MaxInput'

import { Wrapper as PoolWrapper, PoolIcon } from './Pool'

const Wrapper = styled(PoolWrapper)`
  width: 654px;
  margin-top: 75px;
  position: relative;
  padding-top: 0;

  h2 {
    font-size: 26px;
    padding: 15px;
    width: 100%;
    margin: 0;
    border-bottom: 1px solid var(--color-light-blue);
    margin-bottom: 37px;
  }

  > button {
    padding: 0;
    width: auto;
    border-radius: 0;
    border: 0;

    position: absolute;
    left: 0;
    top: -50px;

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

  label + p {
    margin-top: 12px;
  }

  .actions {
    margin: 29px -7px -7px;

    button {
      border-radius: 10px;

      display: flex;
      align-items: center;
      margin: 7px;
      padding: 8px 12px;

      img {
        margin-right: 8px;
      }
    }
  }

  .claim p {
    max-width: 220px;
    width: 220px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

const Stake = styled.div`
  width: 100%;

  .input {
    text-align: left;
    max-width: 300px;

    label + p {
      margin-top: 12px;
      margin-bottom: 0;
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
  }
`

const Unstake = styled(Stake)``

const Claim = styled(Stake)``

function PoolDetail({ base, pair, rewardBase, stake, metamask, library, transactions, dispatch }) {
  const { address } = metamask
  const [stakeForm, setStakeForm] = useState({ amount: 0 })
  const [approveTx, setApproveTx] = useState(null)
  const [stakeTx, setStakeTx] = useState(null)
  const [unstakeForm, setUnstakeForm] = useState({ amount: 0 })
  const [unstakeTx, setUnstakeTx] = useState(null)
  const [claimTx, setClaimTx] = useState(null)
  const [mode, setMode] = useState('')

  useEffect(() => {
    if (stakeTx && transactions[stakeTx]) {
      console.log(transactions[stakeTx])
      setStakeTx(null)
    }
    if (unstakeTx && transactions[unstakeTx]) {
      console.log(transactions[unstakeTx])
      setUnstakeTx(null)
    }
    if (claimTx && transactions[claimTx]) {
      console.log(transactions[claimTx])
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
    const { approve } = library.methods.LSTWETHUNIV2
    approve(library.addresses.LSTETHPool, web3.utils.toWei((10 ** 8).toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setApproveTx(hash)
      })
      .on('receipt', function (receipt) {
        dispatch({
          type: 'METAMASK',
          payload: {
            aLSTWETHUNIV2: Number(web3.utils.fromWei(receipt.events.Approval.returnValues.value)),
          },
        })
        setApproveTx(null)
      })
      .on('error', (err) => {
        console.log(err)
        setApproveTx(null)
      })
  }

  const handleStake = () => {
    const { amount } = stakeForm
    const { stake } = library.methods.LSTETHPool
    stake(web3.utils.toWei(amount.toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setStakeTx(hash)
      })
      .on('receipt', function (receipt) {
        // setStakeTx(null)
      })
      .on('error', (err) => {
        console.log(err)
        setStakeTx(null)
      })
  }

  const handleUnstake = () => {
    const { amount } = unstakeForm
    const { unstake } = library.methods.LSTETHPool
    unstake(web3.utils.toWei(amount.toString()), { from: address })
      .send()
      .on('transactionHash', function (hash) {
        setUnstakeTx(hash)
      })
      .on('receipt', function (receipt) {
        // setUnstakeTx(null)
      })
      .on('error', (err) => {
        console.log(err)
        setUnstakeTx(null)
      })
  }

  const handleClaim = () => {
    const { claim } = library.methods.LSTETHPool
    claim({ from: address })
      .send()
      .on('transactionHash', function (hash) {
        setClaimTx(hash)
      })
      .on('receipt', function (receipt) {
        // setClaimTx(null)
      })
      .on('error', (err) => {
        console.log(err)
        setClaimTx(null)
      })
  }

  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <Link href="/[base]" as={`/${base.toLowerCase()}`}>
        <button
          className="white uppercase"
          onClick={(e) => {
            if (mode) {
              e.preventDefault()
              setMode('')
            }
          }}
        >
          <img src="/assets/back.svg" alt="Go Back" />
          Back
        </button>
      </Link>
      <h2 className="flex-center justify-center">
        <PoolDetailIcon className="flex-center">
          <img src={`/assets/${base.toLowerCase()}-token.svg`} alt={base} />
          <img src={`/assets/${pair.toLowerCase()}-token.svg`} alt={pair} />
        </PoolDetailIcon>
        {base}/{pair} POOL
      </h2>
      {!mode && (
        <Detail className="flex justify-around">
          <div className="stake">
            <label>{stake} Staked</label>
            <p>{metamask.LSTETHPool || 0}</p>
            <div className="actions flex">
              <button
                className="uppercase red"
                onClick={() => (metamask.aLSTWETHUNIV2 > metamask.LSTWETHUNIV2 ? handleMode('stake') : handleApprove())}
                disabled={!metamask.LSTWETHUNIV2 || approveTx}
              >
                <img src="/assets/stake.svg" alt="Stake" />
                {metamask.aLSTWETHUNIV2 > metamask.LSTWETHUNIV2 ? 'Stake' : 'Unlock'}
              </button>
              <button className="uppercase red" onClick={() => handleMode('unstake')} disabled={!metamask.LSTETHPool}>
                <img src="/assets/unstake.svg" alt="Unstake" />
                Unstake
              </button>
            </div>
          </div>
          <div className="claim">
            <label>Unclaimed {rewardBase} Tokens</label>
            <p>{metamask.eLSTETHPool || 0}</p>
            <div className="actions flex">
              <button className="uppercase red" onClick={() => handleMode('claim')} disabled={!metamask.eLSTETHPool}>
                <img src={`/assets/claim-${rewardBase}.svg`} alt="Claim" />
                Claim {rewardBase}
              </button>
            </div>
          </div>
        </Detail>
      )}
      {mode === 'stake' && (
        <Stake>
          <div className="flex justify-around">
            <div className="input">
              <label>{stake} Balnace</label>
              <p>{metamask.LSTWETHUNIV2 || 0}</p>
            </div>
            <MaxInput
              label="Amount to Stake"
              value={stakeForm.amount}
              min={0}
              onChange={(e) => setStakeForm({ amount: Math.min(e.target.value, metamask.LSTWETHUNIV2) })}
              onMax={() => setStakeForm({ amount: metamask.LSTWETHUNIV2 })}
            />
          </div>
          {/* <p className="label">Balnace : {metamask.LSTWETHUNIV2}</p> */}
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
              <p>{metamask.LSTETHPool || 0}</p>
            </div>
            <MaxInput
              label="Amount Losable"
              value={unstakeForm.amount}
              min={0}
              onChange={(e) => setUnstakeForm({ amount: Math.min(e.target.value, metamask.LSTETHPool) })}
              onMax={() => setUnstakeForm({ amount: metamask.LSTETHPool })}
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
              <p>{metamask.eLSTETHPool || 0}</p>
            </div>
          </div>
          <button className="uppercase red" disabled={!!claimTx || metamask.eLSTETHPool === 0} onClick={handleClaim}>
            Claim Now
          </button>
        </Claim>
      )}
    </Wrapper>
  )
}

export default connect(({ metamask, library, transactions }) => ({ metamask, library, transactions }))(PoolDetail)
