import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  ReferenceDot,
  ReferenceLine,
  Label,
  ComposedChart,
} from 'recharts'
import { getDuration } from 'utils/hooks'

export const EPOCH_PERIOD = process.env.EPOCH_PERIOD

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
    color: var(--color-red2);

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

  text:not(.static-tip) {
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
  const offset = current && Math.ceil((current.timestamp * 1000 - now) / 1000)

  useEffect(() => {
    if (current && !duration) {
      getCurrent()
    }
  }, [current, duration])

  const [purchase, setPurcase] = useState(null)
  const [data, setData] = useState([])

  useEffect(() => {
    if (current && (!purchase || offset < 5 || offset % 15 === 0)) {
      // if (purchase && purchase.xPos === xPos) return
      const t1 = parseInt(current.timestamp - now / 1000)
      const max = t1 > 0 ? (current.price / t1) * EPOCH_PERIOD : current.maxY
      const start = lastPurchase
        ? current.epoch - lastPurchase.epoch === 1
          ? lastPurchase.amount * 2
          : lastPurchase.amount
        : max
      // const currentPrice = ((start - current.minY) * (EPOCH_PERIOD - x) + EPOCH_PERIOD) / EPOCH_PERIOD
      const currentPrice = current.price
      const currentTime = EPOCH_PERIOD - ((currentPrice - current.minY) / (start - current.minY)) * EPOCH_PERIOD

      setPurcase({
        epoch: current.epoch,
        start,
        end: current.minY,
        current: currentPrice,
        time: currentTime,
      })

      setData([
        {
          time: 0,
          price: start,
          toolTip: `Start Price @ ${start.toFixed(0)}$hrimp`,
          className: 'red',
        },
        {
          time: currentTime,
          price: currentPrice,
          // toolTip: `Current Price @ ${currentPrice.toFixed(0)}$hrimp`,
          current: currentPrice,
          className: 'green',
        },
        {
          time: EPOCH_PERIOD,
          price: current.minY,
          toolTip: `End Price @ ${current.minY.toFixed(0)}$hrimp`,
          current: current.minY,
          className: 'grey',
        },
      ])
    }
  }, [current, lastPurchase, offset])

  return (
    <Wrapper className="auction-list">
      {purchase &&
        (current.price > 0 ? (
          <>
            <Graph>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dy: 10 }}
                    type="number"
                    domain={[0, EPOCH_PERIOD]}
                    tickFormatter={(value) => `${Number((value / 60 / 60).toFixed(1))}h`}
                  ></XAxis>
                  <YAxis tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dx: -10 }}></YAxis>
                  <Tooltip
                    content={<CustomTooltip />}
                    offset={0}
                    allowEscapeViewBox={{ x: true, y: true }}
                    cursor={{ stroke: '#0099F2', strokeDasharray: '3 3' }}
                    active
                  />
                  <Line
                    dataKey="price"
                    stroke="#bd84a3"
                    strokeWidth={2}
                    dot={{ stroke: 'white', fill: 'var(--color-dark-grey)', r: 6, strokeWidth: 2 }}
                    activeDot={{
                      fill: 'var(--color-red2)',
                      r: 6,
                      boxShadow: '0 1px 7px 0 rgba(255,144,96,0.72)',
                    }}
                    type="linearClosed"
                  />
                  <Area
                    dataKey="current"
                    fill="#8884d8"
                    stroke="#8884d8"
                    dot={{ stroke: 'white', fill: 'var(--color-dark-grey)', r: 6, strokeWidth: 2 }}
                    activeDot={{
                      fill: 'var(--color-dark-grey)',
                      r: 6,
                      boxShadow: '0 1px 7px 0 rgba(255,144,96,0.72)',
                    }}
                  />
                  <ReferenceLine x={purchase.time} strokeDasharray="3 3" stroke="#94EBF0" />
                  <ReferenceDot
                    x={purchase.time}
                    y={purchase.current}
                    r={6}
                    fill="#94EBF0"
                    stroke="white"
                    strokeWidth={2}
                  >
                    <Label
                      content={(props) => {
                        const { x, y } = props.viewBox
                        return (
                          <g transform={`translate(${x},${y - 42})`}>
                            <text x={0} y={0} fill="#2FB2BA" fontSize={10} fontWeight={100} className="static-tip">
                              <tspan textAnchor="middle" x="0">
                                Current Price @
                              </tspan>
                              <tspan textAnchor="middle" x="0" dy="16">
                                {purchase.current.toFixed(2)}$hrimp
                              </tspan>
                            </text>
                          </g>
                        )
                      }}
                      offset={0}
                      position="top"
                    />
                  </ReferenceDot>
                </ComposedChart>
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
        ) : (
          <>
            <p>
              The auction for this epoch has ended.
              <br />
              The next auction begins in
              <br />
              <Remaining>{duration || '00:00:00'}</Remaining>
            </p>
          </>
        ))}
    </Wrapper>
  )
}
