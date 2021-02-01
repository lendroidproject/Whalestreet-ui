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

export async function getUSDPrice(tokenAddress) {
  console.log(tokenAddress)
  try {
    const { data: tokenData } = await graphClient.query({
      query: gql`
      {
        token(id: "${tokenAddress.toLowerCase()}"){
          name
          symbol
          decimals
          derivedETH
          tradeVolumeUSD
          totalLiquidity
        }
      }`
    });
    const derivedETH = tokenData?.token?.derivedETH;
  
    const { data: bundleData } = await await graphClient.query({
      query: gql`
      {
        bundle(id: "1") {
          ethPrice
        }
      }`
    });
    const ethPrice = bundleData?.bundle?.ethPrice

    return new BigNumber(derivedETH || 0).multipliedBy(ethPrice || 0).toString()
  } catch (err) {
    console.log(err)
  }
  return 0
}