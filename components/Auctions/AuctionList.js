import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Auction = styled.div`
  max-width: 651px;
  margin: 10px auto 15px;
  border-radius: 12px;
  background-color: var(--color-blue);
  color: var(--color-white);

  padding: 13px 30px 18px;

  table {
    width: 100%;
    text-align: left;
  }

  th {
    font-size: 14px;
    line-height: 21px;
    text-transform: uppercase;
  }

  td {
    padding-top: 12px;
    font-size: 20px;
    line-height: 29px;
  }

  .epoc {
    width: 15%;
  }

  .price {
    width: 30%;
  }

  .remaining {
    width: 37%;
  }

  .actions {
    min-width: 107px;

    button {
      background: var(--color-red);
      border-radius: 7px;
      text-transform: uppercase;

      padding: 5px 14px;
      font-size: 16px;
      line-height: 24px;
    }
  }
`

const Epoc = styled.div`
  font-size: 17px;
  line-height: 17px;

  height: 26px;
  width: 26px;
  background-color: var(--color-white);
  border-radius: 50%;
  color: var(--color-blue);
`
const Price = styled.div`
  img {
    height: 26px;
    margin-right: 6px;
  }
`
const Remaining = styled.div``

function getRemaining(date, now) {
  const time = new Date(date).getTime()
  let remaining = parseInt((now - time) / 1000)
  const seconds = `00${remaining % 60}`.slice(-2)
  remaining = (remaining - (remaining % 60)) / 60
  const mins = `00${remaining % 60}`.slice(-2)
  const hours = `00${(remaining - (remaining % 60)) / 60}`.slice(-2)
  return `${hours}:${mins}:${seconds}`
}

function useTicker() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return [now]
}

export default function AuctionList({ auctions }) {
  const [now] = useTicker()

  return (
    <Wrapper className="auction-list">
      {auctions.map(({ id, epoc, price, expiry }) => (
        <Auction key={id}>
          <table>
            <tr>
              <th className="epoc">Epoc</th>
              <th className="price">Price</th>
              <th className="remaining">Remaining Time</th>
              <th className="actions" rowSpan={2}>
                <button>Purchase</button>
              </th>
            </tr>
            <tr>
              <td>
                <Epoc className="flex-all">{epoc}</Epoc>
              </td>
              <td>
                <Price className="flex-center">
                  <img src="/assets/$hrimp-token.svg" alt="" />
                  {price}
                </Price>
              </td>
              <td>
                <Remaining>{getRemaining(expiry, now)}</Remaining>
              </td>
            </tr>
          </table>
        </Auction>
      ))}
    </Wrapper>
  )
}
