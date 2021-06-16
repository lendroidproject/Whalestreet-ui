import React from 'react'
import { connect } from 'react-redux'
import Marquee from './Marquee'

export default connect(({ wallet }) => ({ wallet }))(function PriceMarquee({ wallet }) {
  // const text = `$HRIMP BALANCE - ${(wallet.$HRIMP || 0).toFixed(2)} $HRIMP PRICE ${
  //   wallet.shrimpPrice || 0.2909
  // } $HRIMP TOTAL SUPPLY ${(wallet.s$HRIMP || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')} LST PRICE ${
  //   wallet.lstPrice || '1.234'
  // }.`
  const text = `
    $HRIMP BALANCE - ${(wallet.$HRIMP || 0).toFixed(2)}
    $HRIMP CURRENT SUPPLY ${(wallet.s$HRIMP || 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')}
    LST BALANCE ${(wallet.LST || 0).toFixed(2)}
    ETH BALANCE ${(wallet.balance || 0).toString().match(/^-?\d+(?:\.\d{0,8})?/)[0]}.
  `

  return (
    <>
      <Marquee text={`${text} ${text} ${text}`} />
      <Marquee text={`${text} ${text} ${text}`} dir={1} />
      <Marquee text={`${text} ${text} ${text}`} dir={3} />
    </>
  )
})
