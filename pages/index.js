import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import Link from 'next/link'

import PriceMarquee from 'components/common/PriceMarquee'
import { PageWrapper as Wrapper } from 'components/styles'

const Modules = styled.div`
  a {
    margin: 5px 10px;
    text-decoration: none;
  }
`

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="bg flex-all">
        <video poster="/assets/bg.jpg" autoPlay="autoPlay" loop="loop" muted></video>
        <PriceMarquee />
      </div>
      <Wrapper className="center">
        <h1>Welcome to Whale Street.</h1>
        <p className="intro">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia.
          <br />
          <br />
          <a className="watch-video" href="/">
            <img src="/assets/video.png" alt="Welcome to Whale Street" />
            Watch Video
          </a>
        </p>
        <Modules className="flex-wrap justify-center">
          <Link href="/farming">Farming</Link>
          <Link href="/auctions">Auctions</Link>
        </Modules>
      </Wrapper>
    </>
  )
}
