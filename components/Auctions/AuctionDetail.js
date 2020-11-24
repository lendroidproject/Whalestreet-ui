import React from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Label } from 'recharts'
import { Epoc } from './AuctionList'

const Wrapper = styled.div`
  z-index: 101;

  .portal-content {
    max-width: 788px;
    width: 100%;
    margin: 30px auto 0;
    position: relative;
    animation: fadeIn ease 0.5s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const Overlay = styled.div`
  opacity: 0.94;
  background-color: var(--color-white);
  z-index: -1;
`

const Close = styled.div`
  position: absolute;
  right: 0;
  top: -40px;
  color: var(--color-red);
  font-size: 18px;
  letter-spacing: 0.18px;
  line-height: 26px;

  img {
    margin-left: 8px;
  }
`

const Auction = styled.div`
  border-radius: 12px;
  background-color: var(--color-blue);
  color: var(--color-white);
  padding: 13px 10px;
  margin-bottom: 30px;

  .epoc {
    width: 15%;
    text-align: center;
  }

  .purchases {
    width: 30%;
  }

  .starting {
    width: 37%;
  }

  .ending {
    width: 37%;
  }

  .duration {
    width: 33%;
  }

  .actions {
    min-width: 32px;

    img {
      height: 20px;
      transform: rotate(90deg);
    }
  }
`

export const DetailEpoc = styled(Epoc)`
  margin: auto;
  background-color: var(--color-white);
  color: var(--color-black);
`

const Duration = styled.div``

const Graph = styled.div`
  border-radius: 12px;
  background-color: var(--color-black);
  box-shadow: var(--box-shadow-dark);
  padding: 60px 15px;

  .recharts-surface {
    overflow: visible;
  }

  .custom-tooltip {
    border-radius: 3px;
    background-color: var(--color-white);
    padding: 10px;

    font-size: 10px;
    letter-spacing: 0.1px;
    line-height: 16px;
    font-weight: normal;
    width: 107px;
    text-align: center;

    transform: translate(-50%, -140%);
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: calc(50% - 7.5px);
      top: calc(100% - 10px);
      width: 15px;
      height: 15px;
      transform: rotate(45deg);
      background: var(--color-white);
    }
  }
`

export const getDate = (timestamp) => new Date(timestamp * 1000).toISOString().split('T')[0]

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active) {
    return <div className="custom-tooltip">Start Price @ {payload[0].value}$hrimp</div>
  }
  return null
}

const data = [
  {
    name: '1h',
    price: 24,
  },
  {
    name: '2h',
    price: 13,
  },
  {
    name: '3h',
    price: 28,
  },
  {
    name: '4h',
    price: 10,
  },
  {
    name: '5h',
    price: 14,
  },
  {
    name: '6h',
    price: 29,
  },
  {
    name: '7h',
    price: 9,
  },
  {
    name: '8h',
    price: 22,
  },
]

export default function AuctionDetail({ auction, onClose }) {
  const { id, epoch, purchases, amount, timestamp } = auction
  return ReactDom.createPortal(
    <Wrapper className="auction-detail portal fill flex-all">
      <Overlay className="fill" />
      <div className="portal-content">
        <Close className="uppercase flex-center cursor" onClick={onClose}>
          Close
          <img src="/assets/close-button.svg" alt="" />
        </Close>
        <Auction className="flex" key={id}>
          <div className="epoc">
            <DetailEpoc>{epoch}</DetailEpoc>
          </div>
          <div className="purchases">{purchases.length}</div>
          <div className="starting">{amount.toFixed(2)}</div>
          <div className="ending">{amount.toFixed(2)}</div>
          <div className="duration">
            <Duration>{getDate(timestamp)}</Duration>
          </div>
          <div className="actions flex-all">
            <img src="/assets/arrow-point-to-right-white.svg" alt="" className="cursor" />
          </div>
        </Auction>
        <Graph>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dy: 10 }}
              >
                <Label
                  value="Hours"
                  offset={-30}
                  position="insideBottom"
                  style={{ fontWeight: 'normal', fill: 'white', fontSize: 14 }}
                />
              </XAxis>
              <YAxis tick={{ stroke: 'white', fontWeight: 'normal', fill: 'white', fontSize: 11, dx: -10 }}>
                <Label
                  value="$hrimp"
                  offset={-10}
                  position="insideLeft"
                  angle={90}
                  style={{ fontWeight: 'normal', fill: 'white', fontSize: 14 }}
                />
              </YAxis>
              <Tooltip
                content={<CustomTooltip />}
                offset={0}
                allowEscapeViewBox={{ x: true, y: true }}
                cursor={{ stroke: '#0099F2', strokeDasharray: '3 3' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0099F2"
                strokeWidth={2}
                dot={{ stroke: 'white', fill: 'var(--color-dark-grey)', r: 8, strokeWidth: 2 }}
                activeDot={{ strokeWidth: 0, fill: 'var(--color-red)', r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Graph>
      </div>
    </Wrapper>,
    document.body
  )
}
