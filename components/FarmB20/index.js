import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import { pools, uniV2Pools, uniV2s } from 'layouts/constants'
import { resolvePromise } from 'layouts/Account'
import PoolList from './PoolList'

export default connect((state) => state)(function FarmB20({ account, farming: library, poolInfo = {}, dispatch }) {
  const fetchInfo = () => {
    const address = account?.address
    Promise.all([
      Promise.all(
        uniV2s.map((token) =>
          Promise.all(
            uniV2Pools[token].map((pool) =>
              address
                ? resolvePromise(library.methods[token].getAllowance(address, library.netAddresses[pool]))
                : Promise.resolve('0')
            )
          )
        )
      ),
      Promise.all(uniV2s.map((token) => resolvePromise(library.methods[token].totalSupply()))),
      Promise.all(
        pools.map((token) =>
          address ? resolvePromise(library.methods[token].getBalance(address)) : Promise.resolve('0')
        )
      ),
      Promise.all(
        pools.map((token) =>
          address ? resolvePromise(library.methods[token].getEarned(address)) : Promise.resolve('0')
        )
      ),
      Promise.all(pools.map((token) => resolvePromise(library.methods[token].totalSupply()))),
      Promise.all(
        pools.map((token) =>
          address ? resolvePromise(library.methods[token].lastEpochStaked(address)) : Promise.resolve('0')
        )
      ),
    ])
      .then(([_uniV2Allowances, _uniV2Supplies, _poolBalances, _poolEarnings, _poolSupplies, _poolLastEpochs]) => {
        function toNumber(value, decimal = 12) {
          const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimal}})?`)
          const val = Number(value.toString().match(regex)[0])
          return val < 0.1 ** Math.max(decimal - 5, 2) ? 0 : val
        }
        const uniV2Allowances = _uniV2Allowances
          .reduce((a, c) => [...a, ...c], [])
          .map((val) => library.web3.utils.fromWei(val))
          .map((val) => toNumber(val))
        const uniV2Supplies = _uniV2Supplies.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
        const poolBalances = _poolBalances.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
        const poolEarnings = _poolEarnings.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
        const poolSupplies = _poolSupplies.map((val) => library.web3.utils.fromWei(val)).map((val) => toNumber(val))
        const poolLastEpochs = _poolLastEpochs.map(Number)
        const findSome = (val, key) => val.some((item) => item !== poolInfo[key])
        if (
          findSome(uniV2Allowances, 'uniV2Allowances') ||
          findSome(uniV2Supplies, 'uniV2Supplies') ||
          findSome(poolBalances, 'poolBalances') ||
          findSome(poolEarnings, 'poolEarnings') ||
          findSome(poolSupplies, 'poolSupplies') ||
          findSome(poolLastEpochs, 'poolLastEpochs')
        ) {
          dispatch({
            type: 'POOL_INFO',
            payload: {
              uniV2Allowances,
              uniV2Supplies,
              poolBalances,
              poolEarnings,
              poolSupplies,
            },
          })
        }
      })
      .catch(console.log)
  }
  useEffect(() => {
    fetchInfo()
  }, [account])
  return (
    <>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <PoolList />
    </>
  )
})
