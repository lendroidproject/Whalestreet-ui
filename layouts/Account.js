import styled from 'styled-components'
import { connect } from 'react-redux'

const Wrapper = styled.div`
  .connect {
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;

    border: 1px solid var(--color-black);
    border-radius: 14px;
    background-color: var(--color-black);
    color: var(--color-white);
    padding: 6px 15px;
  }
`

export default connect((state) => state)(function Account({ metamask }) {
  return <Wrapper>{metamask.address ? metamask.address : <button className="connect">Connect Wallet</button>}</Wrapper>
})
