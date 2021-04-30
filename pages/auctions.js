import React from 'react'
import SEO from 'layouts/seo'
import Link from 'next/link'

import Auctions from 'components/Auctions'

export default function AuctionsPage() {
  return (
    <>
      <SEO title="Auctions" />
      {/* <Auctions /> */}
      <div className="bg flex-all">
        <img src="/assets/bg_auction.jpg" alt="Auctions" />
      </div>
      <div className="center flex-all" style={{ height: '100%' }}>
        <h1>Coming soon...</h1>
        <Link href="/">Go Home</Link>
      </div>
    </>
  )
}
