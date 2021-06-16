import React, { useEffect } from 'react'
import SEO from 'layouts/seo'
import Link from 'next/link'
import { connect } from 'react-redux'

import Auctions from 'components/Auctions'
import Spinner from 'components/common/Spinner'

export default connect((state) => state)(function AuctionsPage({ wallet, auctions: library }) {
  useEffect(() => {
    wallet.register('auctions')
  }, [])
  return (
    <>
      <SEO title="Auctions" />
      {process.env.AUCTION_ENABLED ? (
        library ? (
          <Auctions />
        ) : (
          <Spinner />
        )
      ) : (
        <>
          <div className="bg flex-all">
            <img src="/assets/bg_auction.jpg" alt="Auctions" />
          </div>
          <div className="center flex-all" style={{ height: '100%' }}>
            <h1>Coming soon...</h1>
            <Link href="/">Go Home</Link>
          </div>
        </>
      )}
    </>
  )
})
