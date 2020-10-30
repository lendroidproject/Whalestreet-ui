import Web3 from 'web3'
import $HRIMP from './$HRIMP.json'
import LSTWETHUNIV2 from './LSTWETHUNIV2.json'
import LSTETHPool from './LSTETHPool.json'

const addresses = {
  MAIN_NETWORK: false,
  $HRIMP: '0x7186013ABe25De7dd79e191f3251bE73B72Db037',
  LST_WETH_UNI_V2: '0xFB5b443ae22080b456C4b5ff2c06a4aD987B89A7',
  LSTETHPool: '0xdF011A6c60Ca415a24D2db7Feb862E8Dc2664f7D',
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
    $HRIMP: new web3.eth.Contract($HRIMP, addresses.$HRIMP),
    LSTWETHUNIV2: new web3.eth.Contract(LSTWETHUNIV2, addresses.LST_WETH_UNI_V2),
    LSTETHPool: new web3.eth.Contract(LSTETHPool, addresses.LSTETHPool),
  }
  const methods = {
    $HRIMP: {
      getBalance: call(contracts.$HRIMP.methods.balanceOf),
      totalSupply: call(contracts.$HRIMP.methods.totalSupply),
      getAllowance: (addr) => call(contracts.$HRIMP.methods.allowance)(addr, addresses.LSTETHPool),
      approve: send(contracts.$HRIMP.methods.approve),
    },
    LSTWETHUNIV2: {
      getBalance: call(contracts.LSTWETHUNIV2.methods.balanceOf),
      getAllowance: (addr) => call(contracts.LSTWETHUNIV2.methods.allowance)(addr, addresses.LSTETHPool),
      approve: send(contracts.LSTWETHUNIV2.methods.approve),
    },
    LSTETHPool: {
      getBalance: call(contracts.LSTETHPool.methods.balanceOf),
      getEarned: call(contracts.LSTETHPool.methods.earned),
      stake: send(contracts.LSTETHPool.methods.stake),
      unstake: send(contracts.LSTETHPool.methods.unstake),
      claim: send(contracts.LSTETHPool.methods.claim),
    },
  }
  contracts.$HRIMP.events
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
