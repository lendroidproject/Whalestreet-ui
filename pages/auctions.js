import React from 'react'
import { Helmet } from 'react-helmet'
import Auctions from 'components/Auctions'

export default function AuctionsPage() {
  return (
    <>
      <Helmet>
        <title>Auctions</title>
      </Helmet>
      <Auctions />
    </>
  )
}
