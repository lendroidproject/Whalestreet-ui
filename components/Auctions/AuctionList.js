import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Label } from 'recharts'
import { getDuration } from 'utils/hooks'

export const EPOCH_PERIOD = process.env.NETWORKS.includes(1) ? 28800 : 60

const Wrapper = styled.div`
  background: var(--color-trans07);
  padding: 40px 60px;
  border-radius: 10px;
  max-width: 820px;
  width: 90%;
  margin: auto;
`

const Auction = styled.div`
  max-width: 651px;
  margin: 20px auto 0;
  border-radius: 12px;
  background-color: var(--color-white);
  color: var(--color-blue2);
  border: 1px solid var(--color-light-purple);

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

  .epoch {
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
      background: var(--color-red2);
      border-radius: 7px;
      text-transform: uppercase;

      padding: 5px 14px;
      font-size: 16px;
      line-height: 24px;
    }
  }
`

export const Epoch = styled.div`
  height: 26px;
  min-width: 26px;
  border-radius: 50%;

  display: inline-flex;
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

const Graph = styled.div`
  .recharts-surface {
    overflow: visible;
  }

  .custom-tooltip {
    border-radius: 3px;
    background-color: transparent;
    padding: 10px;
    color: var(--color-red2) !important;

    font-size: 10px;
    letter-spacing: 0.1px;
    line-height: 16px;
    font-weight: normal;
    width: 120px;
    text-align: center;

    transform: translate(-50%, -140%);
    position: relative;

    &.green {
      color: var(--color-green);
    }
    &.grey {
      color: var(--color-grey2);
    }

    &:after {
      content: '';
      position: absolute;
      left: calc(50% - 7.5px);
      top: calc(100% - 10px);
      width: 15px;
      height: 15px;
      transform: rotate(45deg);
      background: transparent;
    }
  }

  text {
    stroke: #6e6e96;
  }
`

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload[0].payload.toolTip) {
    return <div className={`custom-tooltip ${payload[0].payload.className}`}>{payload[0].payload.toolTip}</div>
  }
  return null
}

export default function AuctionList({
  now,
  current,
  lastPurchase,
  getCurrent,
  allowance,
  onPurchase,
  pending,
  purchased,
}) {
  const duration = current && getDuration(now, current.timestamp * 1000)

  useEffect(() => {
    if (current && !duration) {
      getCurrent()
    }
  }, [current, duration])

  const [purchase, setPurcase] = useState(null)
  const [data, setData] = useState([])
  useEffect(() => {
    if (current) {
      const x = current.timestamp - now / 1000
      const piece = EPOCH_PERIOD / 8
      const xPos = Math.ceil((EPOCH_PERIOD - x) / piece)
      if (purchase && purchase.xPos === xPos) return
      const start = lastPurchase
        ? current.epoch - lastPurchase.epoch === 1
          ? lastPurchase.amount * 2
          : lastPurchase.amount
        : current.maxY
      const currentPrice = ((start - current.minY) * (EPOCH_PERIOD - x) + EPOCH_PERIOD) / EPOCH_PERIOD

      setPurcase({
        epoch: current.epoch,
        start,
        end: current.maxY,
        current: currentPrice,
        xPos,
      })

      const data = []
      for (let i = 0; i <= 8; i++) {
        const price = i === 8 ? current.minY : start - ((start - current.minY) * i) / xPos
        // : i < xPos
        // ? start - ((start - currentPrice) * i) / xPos
        // : current.maxY + ((currentPrice - current.maxY) * (8 - i)) / (8 - xPos)
        data.push({
          name: `${i}h`,
          price,
          toolTip:
            i === 0
              ? `Start Price @ ${price.toFixed(0)}$hrimp`
              : i === xPos
              ? `Current Price @ ${price.toFixed(0)}$hrimp`
              : `${price.toFixed()}$hrimp`,
          className: i === 0 ? `red` : i === xPos ? `green` : 'grey',
        })
      }
      setData(data)
    }
  }, [current, lastPurchase, now])

  return (
    <Wrapper className="auction-list">
      {purchase && (
        <>
          <Graph>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dy: 10 }}
                ></XAxis>
                <YAxis tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dx: -10 }}></YAxis>
                <Tooltip
                  content={<CustomTooltip />}
                  offset={0}
                  allowEscapeViewBox={{ x: true, y: true }}
                  cursor={{ stroke: '#0099F2', strokeDasharray: '3 3' }}
                />
                <Line
                  dataKey="price"
                  stroke="#bd84a3"
                  strokeWidth={2}
                  dot={{ stroke: 'white', fill: 'var(--color-dark-grey)', r: 0, strokeWidth: 2 }}
                  activeDot={{
                    fill: 'var(--color-red2)',
                    r: 6,
                    boxShadow: '0 1px 7px 0 rgba(255,144,96,0.72)',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Graph>
          <Auction>
            <table>
              <tbody>
                <tr>
                  <th className="epoch">Epoch</th>
                  <th className="price">Current Price</th>
                  <th className="remaining">Remaining Time</th>
                  <th className="actions" rowSpan={2}>
                    <button onClick={onPurchase} disabled={purchased || pending || Number(current.price) === 0}>
                      {allowance > 0 ? 'Purchase' : 'Unlock'}
                    </button>
                  </th>
                </tr>
                <tr>
                  <td>
                    <Epoch>{purchase.epoch}</Epoch>
                  </td>
                  <td>
                    <Price className="flex-center">
                      <img src="/assets/$hrimp-token.svg" alt="" />
                      {Number(purchase.current || 0).toFixed(2)}
                    </Price>
                  </td>
                  <td>
                    <Remaining>{duration || '00:00:00'}</Remaining>
                  </td>
                </tr>
              </tbody>
            </table>
          </Auction>
        </>
      )}
    </Wrapper>
  )
}
