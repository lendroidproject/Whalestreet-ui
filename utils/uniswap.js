import { ApolloClient, InMemoryCache, gql  } from '@apollo/client';
import BigNumber from 'bignumber.js';

// NOTE: This supports only mainnet uniswap data fetching
export const graphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  fetchOptions: {
    mode: 'no-cors'
  },
  cache: new InMemoryCache()
});

export async function getTokenPriceUSD(tokenAddress) {
  try {
    const { data } = await graphClient.query({
      query: gql`
      {
        token(id: "${tokenAddress.toLowerCase()}"){
          derivedETH
        }
        bundle(id: "1") {
          ethPrice
        }
      }`
    })
    const derivedETH = data?.token?.derivedETH
    const ethPrice = data?.bundle?.ethPrice

    return new BigNumber(derivedETH || 0).multipliedBy(ethPrice || 0).toString()
  } catch (err) {
    console.log(err)
  }
  return 0
}

export async function getPoolLiquidityUSD(poolAddress) {
  try {
    const { data } = await graphClient.query({
      query: gql`
      {
        pair(id: "${poolAddress.toLowerCase()}") {
          trackedReserveETH
        }
        bundle(id: "1") {
          ethPrice
        }
      }
      `
    });
    const trackedReserveETH = data?.pair?.trackedReserveETH
    const ethPrice = data?.bundle?.ethPrice

    return new BigNumber(ethPrice || 0).dividedBy(trackedReserveETH || 0).toString()
  } catch (err) {
    console.log(err)
  }
  return null;
}