import styled from 'styled-components'
import { connect } from 'react-redux'
import Layout from 'layouts'

const Wrapper = styled.section`
  p {
    max-width: 943px;
    margin: auto;
  }
`

export default connect((state) => state)(function ({ metamask, library, ...props }) {
  // console.log(metamask, library, props)

  return (
    <Layout>
      <Wrapper className="center">
        <h1>Welcome to Whale Street.</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat. beatae
          vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
          quia consequuntur magni.
          <br />
          <br />
          <a>Watch Video</a>
        </p>
      </Wrapper>
    </Layout>
  )
})
