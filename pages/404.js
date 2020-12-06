import React from 'react'
import SEO from 'layouts/seo'

export default function HomePage() {
  return (
    <>
      <SEO title="Not Found" />
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted>
          <source src="/assets/bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="center flex-all" style={{ height: '100%' }}>
        <h1>Page Not Found</h1>
        <a href="/">Go Home</a>
      </div>
    </>
  )
}
