import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

let web3Modal

export default function useWallet() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: process.env.INFURA_ID, // Required
        },
      },
    }
    web3Modal = new Web3Modal({
      // cacheProvider: true,
      providerOptions,
    })
  }, [])

  async function connectWallet() {
    if (web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      setLoading(true)
      const provider = await web3Modal.connect()
      setLoading(false)
      return provider
    } catch (e) {
      setLoading(false)
      return null
    }
  }

  return [loading, connectWallet]
}
