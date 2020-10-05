import styled from 'styled-components'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import Layout from 'layouts'

const Wrapper = styled.section`
`

export default connect((state) => state)(function ({ metamask, library, ...props }) {
  const router = useRouter()
  const { contract } = router.query
  console.log(metamask, library, props, contract, router)

  return (
    <Layout>
      <Wrapper className="center">
        <h1>Farm Shrimp</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </Wrapper>
    </Layout>
  )
})
