import BigNumber from 'bignumber.js'

const fmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: ''
}

BigNumber.config({ FORMAT: fmt })

export function format(value = 0, decimals) {
  return new BigNumber(value).toFormat(decimals)
}
