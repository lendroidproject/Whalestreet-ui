import React from 'react'
import { Helmet } from 'react-helmet'
import Farming from 'components/Farming'

export default function FarmingPage() {
  return (
    <>
      <Helmet>
        <title>Farming</title>
      </Helmet>
      <Farming />
    </>
  )
}
