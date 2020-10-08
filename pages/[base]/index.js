import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import Pool from 'components/Pool'
import { pools } from 'library/constants'
import Spinner from 'components/common/Spinner'

const Wrapper = styled.section``

export default connect(({ library }) => ({ library }))(function ({ library }) {
  const [basePools, setPools] = useState(null)
  const router = useRouter()
  const { base } = router.query

  useEffect(() => {
    const basePools = pools.filter((item) => item.base.toLowerCase() === base)
    if (!basePools.length) router.replace('/')
    else setTimeout(() => setPools(basePools), 250)
  }, [base])

  return !basePools ? (
    <Spinner />
  ) : (
    <Wrapper className="center">
      <h1>Farm Shrimp</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <div className="flex-center justify-center">{basePools.map(Pool)}</div>
    </Wrapper>
  )
})
