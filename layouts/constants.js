export const tokens = ['B20', '$HRIMP', 'LST']
export const uniV2s = ['B20_WETH_UNIV2', '$HRIMP_WETH_UNIV2', 'LST_WETH_UNIV2']
export const pools = [
  'B20_WETH_UNIV2_B20_Pool',
  'B20_WETH_UNIV2_LST_Pool',
  '$HRIMP_WETH_UNIV2_B20_Pool',
  'LST_WETH_UNIV2_$HRIMP_Pool',
  'LST_WETH_UNIV2_B20_Pool',
]
export const uniV2Pools = {
  B20_WETH_UNIV2: ['B20_WETH_UNIV2_B20_Pool', 'B20_WETH_UNIV2_LST_Pool'],
  $HRIMP_WETH_UNIV2: ['$HRIMP_WETH_UNIV2_B20_Pool'],
  LST_WETH_UNIV2: ['LST_WETH_UNIV2_$HRIMP_Pool', 'LST_WETH_UNIV2_B20_Pool'],
}
export const uniV2PoolList = uniV2s.reduce((a, c) => [...a, ...uniV2Pools[c]], [])
