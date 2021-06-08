import axios from 'axios'
import tinyurl from 'tinyurl'
import { networks } from './etherscan'

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY

const network = networks[0]

export function withBaseURL(path) {
  const apiEndpoint = network === 1 ? 'https://api.opensea.io/api/v1' : 'https://rinkeby-api.opensea.io/api/v1'
  return `${apiEndpoint}${path}`
}

// axios.defaults.withCredentials = true
axios.defaults.timeout = 30 * 1000 // Max time limit: 30s
axios.defaults.method = 'GET'
axios.defaults.headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const baseHeaders = {
  'x-api-key': OPENSEA_API_KEY,
}

function jsonConfig(config) {
  return config
}

function request(config, external) {
  if (config.data) {
    jsonConfig(config)
  }

  const { url, headers, ...originConfig } = config

  return axios.request({
    url: !external ? withBaseURL(url) : url,
    headers: !external
      ? {
          ...headers,
          ...baseHeaders,
        }
      : headers,
    ...originConfig,
  })
}

export function getAssets(params, options) {
  return request({
    url: '/assets',
    params,
    ...options,
  })
}

export function getAsset(nftAddr, nftId, ownerAddr) {
  return request({
    url: `/asset/${nftAddr}/${nftId}`,
    params: { account_address: ownerAddr },
  })
}

export function forceFetch({ tokenId, address, owner }) {
  return request(
    {
      url: `https://${
        MAIN_NETWORK ? 'api' : 'rinkeby-api'
      }.opensea.io/asset/${address}/${tokenId}/?force_update=true&account_address=${owner}`,
    },
    true
  )
}

export function fetchMetadata(url) {
  return request({ url }, true)
}

export function tinyURL(url) {
  return new Promise((resolve, reject) => {
    if (url.includes('tinyurl.com')) resolve(url)
    else {
      tinyurl.shorten(url, function (res, err) {
        if (err) reject(err)
        resolve(res) //Returns a shorter version of http://google.com - http://tinyurl.com/2tx
      })
    }
  })
}

export default axios
