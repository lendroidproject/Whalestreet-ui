import Web3 from 'web3'
import HRIMP from './HRIMP.json'
import LSTWETHUNIV2 from './LSTWETHUNIV2.json'
import LSTETHPool from './LSTETHPool.json'

const addresses = {
  MAIN_NETWORK: false,
  $HRIMP: '0x83B5fFD4D0063Ec30aeD0D94ADeB81e5439d11ed',
  LST_WETH_UNI_V2: '0x2E9b1993C0A4baf72ca07937c726AB5730b56C6c',
  LSTETHPool: '0x8f3A1081bb709d8648f70005b21989bE8dB771aa',
}

const call = (method) => (...args) => method(...args).call()
const send = (method) => (...args) => {
  const option = args.pop()
  const transaction = method(...args)
  return {
    estimate: () => transaction.estimateGas(option),
    send: () => transaction.send(option),
    transaction,
  }
}

export default function Index(provider, { onEvent: eventHandler }) {
  const web3 = new Web3(provider)
  const contracts = {
    HRIMP: new web3.eth.Contract(HRIMP, addresses.$HRIMP),
    LSTWETHUNIV2: new web3.eth.Contract(LSTWETHUNIV2, addresses.LST_WETH_UNI_V2),
    LSTETHPool: new web3.eth.Contract(LSTETHPool, addresses.LSTETHPool),
  }
  const methods = {
    HRIMP: {
      getBalance: call(contracts.HRIMP.methods.balanceOf),
      getAllowance: (addr) => call(contracts.HRIMP.methods.allowance)(addr, addresses.LSTETHPool),
      approve: send(contracts.HRIMP.methods.approve),
    },
    LSTWETHUNIV2: {
      getBalance: call(contracts.LSTWETHUNIV2.methods.balanceOf),
      getAllowance: (addr) => call(contracts.LSTWETHUNIV2.methods.allowance)(addr, addresses.LSTETHPool),
      approve: send(contracts.LSTWETHUNIV2.methods.approve),
    },
    LSTETHPool: {
      getBalance: call(contracts.LSTETHPool.methods.balanceOf),
      getRewards: call(contracts.LSTETHPool.methods.rewards),
      stake: send(contracts.LSTETHPool.methods.stake),
      unstake: send(contracts.LSTETHPool.methods.unstake),
      claim: send(contracts.LSTETHPool.methods.claim),
    },
  }
  contracts.HRIMP.events
    .allEvents(
      {
        // ...
      },
      console.info
    )
    .on('data', eventHandler)
  contracts.LSTWETHUNIV2.events
    .allEvents(
      {
        // ...
      },
      console.info
    )
    .on('data', eventHandler)
  contracts.LSTETHPool.events
    .allEvents(
      {
        // ...
      },
      console.info
    )
    .on('data', eventHandler)
  return {
    web3,
    addresses,
    contracts,
    methods,
  }
}
