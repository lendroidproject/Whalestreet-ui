const networks = process.env.NETWORKS.split(',')

export const MAINNET = false
export const isSupportedNetwork = (network) => network && networks.includes(network)
const networkLabels = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
}
export const connectNetworks = () => {
  if (networks.length === 1) {
    return `Please connect to the ${networkLabels[networks[0]]} for now`
  } else {
    return `Please connect to either ${networks.map((id) => networkLabels[id]).join(' or ')}`
  }
}
const links = {
  1: 'https://etherscan.io',
  42: 'https://kovan.etherscan.io',
}
export const networkLabel = (network) => networkLabels[network]
export const txLink = (hash, network) => `${links[network]}/tx/${hash}`
export const tokenLink = (addr, network) => `${links[network]}/token/${addr}`
