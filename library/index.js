import Web3 from 'web3'
import HRIMP from './HRIMP.json'
import LSTWETHUNIV2 from './LSTWETHUNIV2.json'
import LSTETHPool from './LSTETHPool.json'

const addresses = {
  MAIN_NETWORK: false,
  $HRIMP: '0xe40E97AE323A1E663E0687FFA88D33c3C44101D3',
  LST_WETH_UNI_V2: '0x37DB1941bcc5A687cF8E21aaB7058cDC43DD0b44',
  LSTETHPool: '0xfF117e9D0598F1808CFAe3Aeef9Cb0A0Bbd1705e',
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
      getEarned: call(contracts.LSTETHPool.methods.earned),
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
