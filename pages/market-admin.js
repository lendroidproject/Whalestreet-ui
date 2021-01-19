import React from 'react'
import { useRouter } from 'next/router'

import SEO from 'layouts/seo'
import Admin from 'components/Admin'

export default function AdminPage() {
  const router = useRouter()
  return (
    <>
      <SEO title="Market Admin" />
      <Admin />
    </>
  )
}
