import React from 'react'

import SEO from "layouts/seo"
import Auctions from 'components/Auctions'

export default function AuctionsPage() {
  return (
    <>
      <SEO title="Auctions" />
      <Auctions />
    </>
  )
}
