import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import AuctionDetail, { DetailEpoch, getDate } from './AuctionDetail'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Label } from 'recharts'

const EPOCH_PERIOD = 28800

const Wrapper = styled.div`
  max-width: 788px;
  margin: 0 auto 30px;
  position: relative;

  .epoch {
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
    }
  }
`

const Action = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-red2);
  border-radius: 4px;

  position: absolute;
  right: 0;
  top: -40px;
  cursor: pointer;

  img {
    width: 24px;
  }
`

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  max-width: 788px;
  margin: auto;

  .scrollview {
    width: 100%;
    height: 460px;
    display: flex;
    padding-bottom: 80px;
  }

  .ps {
    .ps__rail-x {
      transition: none;
      z-index: 1;
      bottom: 20px;
      opacity: 1;
      height: 12px;
      border: 1px solid #bd84a3;
      border-radius: 7.5px;
      background-color: #ffffff;
    }
    .ps__thumb-x {
      transition: none;
      box-sizing: border-box;
      height: 26px;
      border-radius: 13px;
      background: linear-gradient(180deg, #bd84a3 0%, #984a74 100%);
      bottom: -8px;
    }
  }
`

const Header = styled.div`
  border-radius: 12px;
  background-color: var(--color-blue2);
  color: var(--color-white);
  padding: 14px 10px;
  text-transform: uppercase;
`

const Auction = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid var(--color-light-purple);
  background-color: var(--color-white);
  color: var(--color-blue2);
  padding: 13px 10px;
`

const AuctionItem = styled.div`
  min-width: 263px;
  background: white;
  margin: 0 12px;
  border-radius: 12px;
  padding-top: 25px;
  overflow: hidden;

  .detail {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    padding: 17px 12px 17px;

    color: #989898;
    font-size: 11px;
    font-weight: bold;
    line-height: 16px;

    span {
      color: #9898bc;
      font-size: 18px;
      line-height: 29px;
    }

    > div {
      width: 50%;
      margin-top: 15px;
    }
  }
`

const PurchasedEpoc = styled(DetailEpoch)`
  color: var(--color-blue2);
`

const Duration = styled.div``

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload[0].payload.toolTip) {
    return <div className={`custom-tooltip ${payload[0].payload.className}`}>{payload[0].payload.toolTip}</div>
  }
  return null
}

const Graph = styled.div`
  * {
    transition: none;
  }

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

function AuctionView({ auction, setAuction }) {
  const { id, epoch, purchases, timestamp, x, start, end } = auction

  const data = []
  const piece = EPOCH_PERIOD / 8
  const xPos = Math.ceil((EPOCH_PERIOD - x) / piece)
  const purchase = start - ((start - end) * (EPOCH_PERIOD - x)) / EPOCH_PERIOD
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

  return (
    <AuctionItem className="auction-detail portal">
      <Graph onClick={() => setAuction(id)}>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ stroke: 'white', fontSize: 4, fontWeight: 'normal', fill: 'white', fontSize: 11, dy: 10 }}
            ></XAxis>
            {/* <YAxis
              tick={{ stroke: 'white', fontSize: 4, fontWeight: 'normal', fill: 'white', fontSize: 11, dx: -10 }}
            ></YAxis> */}
            <Tooltip
              content={<CustomTooltip />}
              offset={30}
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
      <div className="flex detail" key={id}>
        <div className="epoch">
          EPOCH
          <br />
          <span>{epoch}</span>
        </div>
        {/* <div className="purchases">
          PURCHASES
          <br />
          <span>{purchases.length}</span>
        </div> */}
        <div className="starting">
          STARTING PRICE
          <br />
          <span>{start.toFixed(2)}</span>
        </div>
        <div className="ending">
          ENDING PRICE
          <br />
          <span>{end.toFixed(2)}</span>
        </div>
        <div className="duration">
          TIME
          <br />
          <span>{getDate(timestamp)}</span>
        </div>
      </div>
    </AuctionItem>
  )
}

export default function AuctionTable({ current, purchases }) {
  const [view, setView] = useState('list')
  const [auction, setAuction] = useState(null)
  useEffect(() => {
    setAuction(null)
  }, [])

  return (
    <>
      {view === 'list' ? (
        <Wrapper className="auction-table">
          <Action className="action" onClick={() => setView('table')}>
            <img src="/assets/table.svg" />
          </Action>
          <Header className="flex">
            <div className="epoch">Epoch</div>
            {/* <div className="purchases">Purchases</div> */}
            <div className="starting">Starting Price</div>
            <div className="ending">Ending Price</div>
            <div className="duration">Time</div>
            <div className="actions" />
          </Header>
          {purchases.map(({ id, epoch, purchases, start, end, amount, timestamp }) => (
            <Auction key={id} className="flex">
              <div className="epoch">
                <PurchasedEpoc>{epoch}</PurchasedEpoc>
              </div>
              {/* <div className="purchases">{purchases.length}</div> */}
              <div className="starting">{start.toFixed(2)}</div>
              <div className="ending">{(end || current?.price || 0).toFixed(2)}</div>
              <div className="duration">
                <Duration>{getDate(timestamp)}</Duration>
              </div>
              <div className="actions flex-all">
                <img src="/assets/arrow-point-to-right.svg" alt="" className="cursor" onClick={() => setAuction(id)} />
              </div>
            </Auction>
          ))}
        </Wrapper>
      ) : (
        <ListWrapper className="auction-list">
          <Action className="action" onClick={() => setView('list')}>
            <img src="/assets/list.svg" />
          </Action>
          <PerfectScrollbar className="scrollview" option={{ suppressScrollY: true }}>
            {purchases.map((purchase) => (
              <AuctionView key={purchase.id} auction={purchase} setAuction={setAuction} />
            ))}
          </PerfectScrollbar>
        </ListWrapper>
      )}
      {auction && (
        <AuctionDetail auction={purchases.find((item) => item.id === auction)} onClose={() => setAuction(null)} />
      )}
    </>
  )
}
