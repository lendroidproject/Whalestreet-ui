import { useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Whale = styled.div`
  font-size: 12px;
  line-height: 17px;

  img {
    width: 130px;
    height: 130px;
    margin-bottom: 10px;
  }
`

export default function WhaleList({ whales }) {
  return (
    <Wrapper className="flex-wrap">
      {whales.map(({ id, logo, name }) => (
        <Whale key={id}>
          <img src={logo} alt="name" />
          <div className="name">{name}</div>
        </Whale>
      ))}
    </Wrapper>
  )
}
