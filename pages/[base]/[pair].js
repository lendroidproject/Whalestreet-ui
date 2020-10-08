import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import PoolDetail from 'components/PoolDetail'
import { pools } from 'library/constants'
import Spinner from 'components/common/Spinner'

const Wrapper = styled.section``

export default connect((state) => state)(function (props) {
  const [pool, setPool] = useState(null)
  const router = useRouter()
  const { base, pair } = router.query

  useEffect(() => {
    const pool = pools.find((item) => item.base.toLowerCase() === base && item.pair.toLowerCase() === pair)
    if (!pool) router.replace(`/${base}`)
    else setTimeout(() => setPool(pool), 250)
  }, [base, pair])

  return !pool ? (
    <Spinner />
  ) : (
    <Wrapper className="center">
      <h1>Stake, Unstake &amp; Claim </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <div className="flex-center justify-center">
        <PoolDetail detail {...pool} />
      </div>
    </Wrapper>
  )
})
