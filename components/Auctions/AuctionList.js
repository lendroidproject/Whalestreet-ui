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

export const Epoc = styled.div`
  font-size: 17px;
  line-height: 17px;

  height: 26px;
  min-width: 26px;
  background-color: var(--color-white);
  border-radius: 50%;
  color: var(--color-blue);

  display: inline-flex;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
`

const Price = styled.div`
  img {
    height: 26px;
    margin-right: 6px;
  }
`

const Remaining = styled.div``

export function getDuration(start, end) {
  if (start >= end) return false
  let remaining = parseInt((end - start) / 1000)
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

export default function AuctionList({ current, getCurrent, allowance, onPurchase, pending }) {
  const [now] = useTicker()
  const duration = current && getDuration(now, current.timestamp * 1000)

  useEffect(() => {
    if (current && !duration) {
      getCurrent()
    }
  }, [current, duration])

  return (
    <Wrapper className="auction-list">
      {current && (
        <Auction>
          <table>
            <tbody>
              <tr>
                <th className="epoc">Epoc</th>
                <th className="price">Price</th>
                <th className="remaining">Remaining Time</th>
                <th className="actions" rowSpan={2}>
                  <button onClick={onPurchase} disabled={pending || current.price === 0}>
                    {allowance > 0 ? 'Purchase' : 'Unlock'}
                  </button>
                </th>
              </tr>
              <tr>
                <td>
                  <Epoc>{current.epoch}</Epoc>
                </td>
                <td>
                  <Price className="flex-center">
                    <img src="/assets/$hrimp-token.svg" alt="" />
                    {current.price}
                  </Price>
                </td>
                <td>
                  <Remaining>{duration || '00:00:00'}</Remaining>
                </td>
              </tr>
            </tbody>
          </table>
        </Auction>
      )}
    </Wrapper>
  )
}
