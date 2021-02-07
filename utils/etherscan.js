export const networks = process.env.NETWORKS.split(',').map(Number)
const definedInfuras = process.env.INFURA_ID.split(',')
export const infuras = {}
networks.forEach((network, idx) => {
  infuras[network] = definedInfuras[idx]
})
export const isSupportedNetwork = (network) => network && networks.includes(network)
const networkLabels = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan network',
}
export const connectNetworks = () => {
  if (networks.length === 1) {
    return `Please connect to the ${networkLabels[networks[0]]}`
  } else {
    return `Please connect to either ${networks.map((id) => networkLabels[id]).join(' or ')}`
  }
}
const links = {
  1: 'https://etherscan.io',
  4: 'https://rinkeby.etherscan.io',
  42: 'https://kovan.etherscan.io',
}
export const networkLabel = (network) => networkLabels[network].split(' ')[0]
export const txLink = (hash, network) => `${links[network]}/tx/${hash}`
export const tokenLink = (addr, network) => `${links[network]}/token/${addr}`
export const uniswapLiquidity = (input, output = 'ETH') => `https://app.uniswap.org/#/add/${input}/${output}`
export const uniswapPair = (pair) => `https://info.uniswap.org/pair/${pair}`
