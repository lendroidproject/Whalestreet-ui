import React from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Label } from 'recharts'
import { Epoch, EPOCH_PERIOD } from './AuctionList'

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
  color: var(--color-red2);
  font-size: 18px;
  letter-spacing: 0.18px;
  line-height: 26px;

  img {
    margin-left: 8px;
  }
`

const Auction = styled.div`
  border-radius: 12px;
  background-color: var(--color-blue2);
  color: var(--color-white);
  padding: 13px 10px;
  margin-bottom: 30px;
  text-align: center;

  .epoch {
    width: 15%;
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

export const DetailEpoch = styled(Epoch)`
  margin: auto;
  // background-color: var(--color-white);
  // color: var(--color-black);
`

const Duration = styled.div``

const Graph = styled.div`
  border-radius: 12px;
  box-shadow: 0 0 11px 0 #D1D1D1;
  padding: 60px 15px;

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

  text {
    stroke: #6e6e96;
  }
`

export const getDate = (timestamp) => new Date(timestamp * 1000).toISOString().split('T')[0]

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload[0].payload.toolTip) {
    return <div className={`custom-tooltip ${payload[0].payload.className}`}>{payload[0].payload.toolTip}</div>
  }
  return null
}

export default function AuctionDetail({ auction, onClose }) {
  const { id, epoch, purchases, timestamp, x, start, end } = auction

  const data = []
  const piece = EPOCH_PERIOD / 8
  const xPos = Math.ceil((EPOCH_PERIOD - x) / piece)
  const purchase = start - (start - end) * (EPOCH_PERIOD - x) / EPOCH_PERIOD
  for (let i = 0; i <= 8; i++) {
    const price = i < xPos ? start - ((start - purchase) * i) / xPos : end + ((purchase - end) * (8 - i)) / (8 - xPos)
    data.push({
      name: `${i}h`,
      price,
      toolTip:
        i === 0
          ? `Start Price @ ${price.toFixed(0)}$hrimp`
          : i === xPos
          ? `Purchase Price @ ${price.toFixed(0)}$hrimp`
          : `${price.toFixed()}$hrimp`,
      className: i === 0 ? `red` : i === xPos ? `red` : 'grey',
    })
  }

  return ReactDom.createPortal(
    <Wrapper className="auction-detail portal fill flex-all">
      <Overlay className="fill" />
      <div className="portal-content">
        <Close className="uppercase flex-center cursor" onClick={onClose}>
          Close
          <img src="/assets/close-button.svg" alt="" />
        </Close>
        <Auction className="flex" key={id}>
          <div className="epoch">
            <DetailEpoch>{epoch}</DetailEpoch>
          </div>
          {/* <div className="purchases">{purchases.length}</div> */}
          <div className="starting">{start.toFixed(2)}</div>
          <div className="ending">{end.toFixed(2)}</div>
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
      </div>
    </Wrapper>,
    document.body
  )
}
