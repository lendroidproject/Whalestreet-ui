export const MAINNET = false
export const txLink = (hash) => `${MAINNET ? 'https://etherscan.io' : 'https://kovan.etherscan.io'}/tx/${hash}`
export const tokenLink = (addr) => `${MAINNET ? 'https://etherscan.io' : 'https://kovan.etherscan.io'}/token/${addr}`
