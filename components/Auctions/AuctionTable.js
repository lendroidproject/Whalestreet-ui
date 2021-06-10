import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Pagination from 'components/common/Pagination'
import Spinner from 'components/common/Spinner'
import { DetailEpoch, getDate } from './AuctionDetail'
import PurchaseDetail from './PurchaseDetail'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Label } from 'recharts'
import { EPOCH_PERIOD } from './AuctionList'
import { format } from 'utils/number'
import { openseaLink } from 'utils/etherscan'
import { shorten } from 'utils/string'

const Wrapper = styled.div`
  max-width: 803px;
  margin: 0 auto 30px;
  position: relative;
  font-size: 14px;
  line-height: normal;
  text-align: left;

  .epoch {
    width: 10%;
  }

  .nft {
    width: 35%;

    .nft-thumb {
      width: 42px;
      height: 42px;
      margin-right: 15px;

      img, iframe {
        width: 100%;
        height: 100%;
        border: 2px solid var(--color-border);
      }
    }

    .nft-info {
      p {
        font-size: 12px;
        font-weight: bold;
      }

      div {
        font-size: 10px;
        font-weight: normal;
      }
    }
  }

  .starting {
    width: 20%;

    img {
      height: 18px;
      margin-right: 6px;
    }
  }

  .owner {
    width: 10%;
  }

  .rarity {
    width: 13%;
  }

  .duration {
    width: 20%;
  }

  .actions {
    min-width: 32px;

    img {
      height: 13px;
    }
  }

  .font-12 {
    font-size: 12px;
  }

  .pagination {
    margin-top: 20px;
  }
  .loader {
    top: 0;
    background: var(--color-white);
    opacity: 0.6;
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
  padding: 16px 15px;
  text-transform: uppercase;
`

const Auction = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid var(--color-light-purple);
  background-color: var(--color-white);
  color: var(--color-blue2);
  padding: 7px 15px;
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
  const { id, epoch, timestamp, x, amount, start, end } = auction

  const [data, setData] = useState([])
  useEffect(() => {
    const piece = EPOCH_PERIOD / 8
    const xPos = Math.ceil((EPOCH_PERIOD - x) / piece)
    const purchase = start - ((start - end) * (EPOCH_PERIOD - x)) / EPOCH_PERIOD
    const data = []
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
    setData(data)
  }, [auction])

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
        {/* <div className="starting">
          STARTING PRICE
          <br />
          <span>{start.toFixed(2)}</span>
        </div>
        <div className="ending">
          ENDING PRICE
          <br />
          <span>{end.toFixed(2)}</span>
        </div> */}
        <div className="purchases">
          PURCHASE AMOUNT
          <br />
          <span>{amount.toFixed(2)}</span>
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

export const Rarity = {
  Common: 'Common',
  Rare: 'Rare',
  Legendary: 'Legendary'
}

export function getRarity(feePercentage) {
  return Number(feePercentage) === 50 ? Rarity.Common : Number(feePercentage) === 25 ? Rarity.Rare : Rarity.Legendary
}

export default function AuctionTable({ current, purchases, loading, pagination }) {
  const [view, setView] = useState('list')
  const [auction, setAuction] = useState(null)
  const ps = useRef()
  useEffect(() => {
    setAuction(null)
  }, [])

  useLayoutEffect(() => {
    if (ps && ps.current) {
      ps.current.scrollLeft = 10000
    }
  }, [ps, ps.current, purchases])

  return (
    <>
      {view === 'list' ? (
        <Wrapper className="auction-table">
          {/* <Action className="action" onClick={() => setView('table')}>
            <img src="/assets/table.svg" />
          </Action> */}
          <Header className="flex">
            <div className="epoch">Epoch</div>
            <div className="nft">NFT</div>
            <div className="rarity">Rarity</div>
            <div className="starting">Purchase Amount</div>
            {/* <div className="owner">Purchased By</div> */}
            <div className="duration">Date & Time</div>
            <div className="actions" />
          </Header>
          {purchases.map(({ id, epoch, purchases, start, end, amount, timestamp, asset, feePercentage }, idx) => (
            <Auction key={`${id}-${idx}`} className="flex-center">
              <div className="epoch">
                <PurchasedEpoc>{epoch}</PurchasedEpoc>
              </div>
              <div className="flex-center cursor nft" onClick={() => setAuction(id)}>
                <div className="nft-thumb">
                  {asset?.image_thumbnail_url ? (
                    <img src={asset?.image_thumbnail_url} alt={asset?.name}/>
                  ) : (
                    <iframe src={asset?.animation_url} title={asset?.name}/>
                  )}
                </div>
                <div className="nft-info">
                  <p>{asset?.name}</p>
                  <div>{asset?.collection?.name}</div>
                </div>
              </div>
              <div className="rarity">
                <div className="flex-center">
                  {getRarity(feePercentage)}
                </div>
              </div>
              <div className="starting">
                <div className="flex-center">
                  <img src="/assets/$hrimp-token.svg" alt="" />
                  {format(amount)}
                </div>
              </div>
              {/* <div className="font-12 owner">
                <a target="_blank" href={openseaLink(purchases[0])}>
                  {shorten(purchases[0])}
                </a>
              </div> */}
              <div className="font-12 duration">
                <Duration>{getDate(timestamp)}</Duration>
              </div>
              <div className="actions flex-all">
                <img src="/assets/arrow-point-to-right.svg" alt="" className="cursor" onClick={() => setAuction(id)} />
              </div>
            </Auction>
          ))}
          <div className="pagination">
            <Pagination className="justify-center" {...pagination} />
          </div>
          {loading && <Spinner className="loader" />}
        </Wrapper>
      ) : (
        <ListWrapper className="auction-list">
          <Action className="action" onClick={() => setView('list')}>
            <img src="/assets/list.svg" />
          </Action>
          <PerfectScrollbar
            className="scrollview"
            option={{ suppressScrollY: true }}
            containerRef={(el) => (ps.current = el)}
          >
            {purchases.map((purchase) => (
              <AuctionView key={purchase.id} auction={purchase} setAuction={setAuction} />
            ))}
          </PerfectScrollbar>
        </ListWrapper>
      )}
      {auction && (
        <PurchaseDetail purchase={purchases.find((item) => item.id === auction)} onClose={() => setAuction(null)} />
      )}
    </>
  )
}
