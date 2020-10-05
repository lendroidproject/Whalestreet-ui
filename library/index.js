import Web3 from 'web3'
import PayoutFactory from './PayoutFactory.json'
import PayoutToken from './PayoutToken.json'
import Payout from './Payout.json'

const addresses = {
  MAIN_NETWORK: false,
  PayoutFactory: '0x5DF0AE8D4F82845a3B5C64ec2868f571CfAb84B1',
  PayoutToken: '0x312dE7f88f8325D98ADf9a2aA1647Dcb474eAE1A',
  // MAIN_NETWORK: true,
  // PayoutFactory: '0xd917C5d176895A6801D164Ac37c8fD8B6e276578',
  // PayoutToken: '0x4EEeA17d9Ad6de3884152AA592d29D8BBF009690',
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
    PayoutFactory: new web3.eth.Contract(PayoutFactory, addresses.PayoutFactory),
    PayoutToken: new web3.eth.Contract(PayoutToken, addresses.PayoutToken),
  }
  const methods = {
    PayoutFactory: {
      create: send(contracts.PayoutFactory.methods.create),
      payoutTokenAddress: call(contracts.PayoutFactory.methods.payoutTokenAddress),
      getWallets: () => {
        return new Promise((resolve, reject) => {
          call(contracts.PayoutFactory.methods.totalDaos)()
            .then((total) => {
              Promise.all(
                new Array(Number(total)).fill(1).map((_, idx) => call(contracts.PayoutFactory.methods.daos)(idx + 1))
              )
                .then(resolve)
                .catch(reject)
            })
            .catch(reject)
        })
      },
    },
    PayoutToken: {
      register: send(contracts.PayoutToken.methods.register),
      userTokens: (user) => {
        return new Promise((resolve, reject) => {
          call(contracts.PayoutToken.methods.balanceOf)(user)
            .then((userTokenCount) => {
              if (!userTokenCount) resolve([])
              else {
                Promise.all(
                  new Array(Number(userTokenCount)).fill(1).map((_, tokenIndex) => {
                    return new Promise((tResolve, tReject) => {
                      call(contracts.PayoutToken.methods.tokenOfOwnerByIndex)(user, tokenIndex)
                        .then((tokenId) => {
                          Promise.all([
                            call(contracts.PayoutToken.methods.metadata)(tokenId),
                            call(contracts.PayoutToken.methods.tokenURI)(tokenId),
                          ])
                            .then(tResolve)
                            .catch(tReject)
                        })
                        .catch(tReject)
                    })
                  })
                )
                  .then(resolve)
                  .catch(reject)
              }
            })
            .catch(reject)
        })
      },
      updateText: send(contracts.PayoutToken.methods.updateText),
      updateImageUrl: send(contracts.PayoutToken.methods.updateImageUrl),
    },
    Payout: {
      auth: (wallet, user) => {
        return new Promise((resolve) => {
          const reject = () => resolve(false)
          const PayoutContract = new web3.eth.Contract(Payout, wallet)
          call(PayoutContract.methods.totalPayees)()
            .then((total) => {
              Promise.all(new Array(Number(total)).fill(1).map((_, idx) => call(PayoutContract.methods.payee)(idx)))
                .then((payees) => {
                  Promise.all(payees.map((payee) => call(contracts.PayoutToken.methods.ownerOf)(payee)))
                    .then((owners) => {
                      const match = owners.findIndex((owner) => owner.toLowerCase() === user.toLowerCase())
                      if (match === -1) reject()
                      else resolve(payees[match])
                    })
                    .catch(reject)
                })
                .catch(reject)
            })
            .catch(reject)
        })
      },
      info: (wallet, tokenId) => {
        return new Promise((resolve) => {
          const reject = () => resolve([0, 0, 0])
          const PayoutContract = new web3.eth.Contract(Payout, wallet)
          Promise.all([
            call(PayoutContract.methods.totalShares)(),
            call(PayoutContract.methods.shares)(tokenId),
            call(PayoutContract.methods.released)(tokenId),
            call(PayoutContract.methods.pendingPayouts)(tokenId),
          ])
            .then(([total, shares, released, pendingPayouts]) => {
              resolve([
                shares / total,
                Number(web3.utils.fromWei(released)),
                Number(web3.utils.fromWei(pendingPayouts)),
              ])
            })
            .catch(reject)
        })
      },
      withdraw: (wallet, ...args) => {
        const PayoutContract = new web3.eth.Contract(Payout, wallet)
        return send(PayoutContract.methods.withdraw)(...args)
      }
    },
  }
  contracts.PayoutFactory.events
    .allEvents(
      {
        // ...
      },
      console.info
    )
    .on('data', eventHandler)
  contracts.PayoutToken.events
    .allEvents(
      {
        // ...
      },
      console.info
    )
    .on('data', eventHandler)
  return {
    web3,
    contracts,
    methods,
  }
}
