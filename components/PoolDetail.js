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

  > button {
    font-size: 20px;
    font-weight: bold;
    line-height: 25px;
    padding: 0;
    width: auto;
    border-raidus: 0;

    position: absolute;
    left: 0;
    top: -50px;

    img {
      margin-right: 9px;
    }
  }
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
      border: 1px solid var(--color-button-border);
      border-radius: 10px;
      background-color: var(--color-button-back);
      color: var(--color-black);
      font-weight: normal;

      display: flex;
      align-items: center;
      margin: 7px;
      padding: 8px 12px;

      img {
        margin-right: 8px;
      }
    }
  }
`

const Stake = styled.div`
  .input {
    margin-top: 30px;
  }

  > button {
    padding: 10px 50px;
    border-radius: 7px;
    margin-top: 30px;
  }
`

const Unstake = styled(Stake)`
  width: 100%;

  .input {
    text-align: left;
  }

  .input label + p {
    margin-top: 12px;
    margin-bottom: 0;
  }
`

function PoolDetail({ detail, base, pair, rewardBase, stake, metamask, library, transactions, dispatch }) {
  console.log(metamask)
  const { address } = metamask
  const [info, setInfo] = useState(detail ? {} : null)
  const [stakeForm, setStakeForm] = useState({ amount: 0 })
  const [approveTx, setApproveTx] = useState(null)
  const [stakeTx, setStakeTx] = useState(null)
  const [unstakeForm, setUnstakeForm] = useState({ amount: 0 })
  const [unstakeTx, setUnstakeTx] = useState(null)
  const [mode, setMode] = useState('')

  useEffect(() => {
    console.log(transactions)
    if (stakeTx && transactions[stakeTx]) {
      console.log(transactions[stakeTx])
      setStakeTx(null)
    }
    if (unstakeTx && transactions[unstakeTx]) {
      console.log(transactions[unstakeTx])
      setUnstakeTx(null)
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
        console.log(receipt)
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

  return (
    <Wrapper className="flex-center flex-column" key={`${base}${pair}`} detail>
      <Link href={`/${base.toLowerCase()}`}>
        <button
          className="white"
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
      <PoolIcon className="flex-center">
        <img src={`/assets/${base.toLowerCase()}.svg`} alt={base} />
        <img src={`/assets/${pair.toLowerCase()}.svg`} alt={pair} />
      </PoolIcon>
      <h2>
        {base}/{pair} POOL
      </h2>
      {!mode && (
        <Detail className="flex justify-around">
          <div className="stake">
            <label>{stake} Staked</label>
            <p>{metamask.LSTETHPool || 0}</p>
            <div className="actions flex">
              <button
                onClick={() =>
                  metamask.aLSTWETHUNIV2 >= metamask.LSTWETHUNIV2 ? handleMode('stake') : handleApprove()
                }
                disabled={!metamask.LSTWETHUNIV2 || approveTx}
              >
                <img src="/assets/stake.svg" alt="Stake" />
                {metamask.aLSTWETHUNIV2 >= metamask.LSTWETHUNIV2 ? 'Stake' : 'Unlock'}
              </button>
              {/* <button onClick={() => setMode('unstake')} disabled={!metamask.LSTETHPool}> */}
              <button onClick={() => setMode('unstake')}>
                <img src="/assets/unstake.svg" alt="Unstake" />
                Unstake
              </button>
            </div>
          </div>
          <div className="claim">
            <label>Unclaimed {rewardBase} Tokens</label>
            <p>{info.claim || 0}</p>
            <div className="actions flex">
              <button onClick={() => setMode('claim')} disabled={!info.claim}>
                <img src={`/assets/claim-${rewardBase}.svg`} alt="Unstake" />
                Claim {rewardBase}
              </button>
            </div>
          </div>
        </Detail>
      )}
      {mode === 'stake' && (
        <Stake>
          <MaxInput
            label={stake}
            value={stakeForm.amount}
            min={0}
            onChange={(e) => setStakeForm({ amount: Math.min(e.target.value, metamask.LSTWETHUNIV2) })}
            onMax={() => setStakeForm({ amount: metamask.LSTWETHUNIV2 })}
          />
          <button disabled={!!stakeTx} onClick={handleStake}>
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
              label={stake}
              value={unstakeForm.amount}
              min={0}
              onChange={(e) => setUnstakeForm({ amount: Math.min(e.target.value) })}
              // onChange={(e) => setUnstakeForm({ amount: Math.min(e.target.value, metamask.LSTETHPool) })}
              onMax={() => setUnstakeForm({ amount: metamask.LSTETHPool })}
            />
          </div>
          <button disabled={!!unstakeTx} onClick={handleUnstake}>
            Unstake Now
          </button>
        </Unstake>
      )}
    </Wrapper>
  )
}

export default connect(({ metamask, library, transactions }) => ({ metamask, library, transactions }))(PoolDetail)
