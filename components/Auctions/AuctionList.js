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
import ReactTooltip from 'rc-tooltip'
import { getDuration } from 'utils/hooks'
import { format } from 'utils/number'
import Spinner from 'components/common/Spinner'
import PurchaseDetail from './PurchaseDetail'
import 'rc-tooltip/assets/bootstrap_white.css'

export const EPOCH_PERIOD = process.env.EPOCH_PERIOD
export const Rarity = {
  Legendary: {
    name: 'Legendary',
    chance: 15,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imgSrc: '/assets/legendary.svg'
  },
  Rare: {
    name: 'Rare',
    chance: 35,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imgSrc: '/assets/rare.svg'
  },
  Common: {
    name: 'Common',
    chance: 50,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imgSrc: '/assets/common.svg'
  },
}
export function getRarity(feePercentage) {
  return Number(feePercentage) === 50 ? Rarity.Common : Number(feePercentage) === 25 ? Rarity.Rare : Rarity.Legendary
}
export const getDate = (timestamp) =>
  new Date(timestamp * 1000)
    .toISOString()
    .split('T')
    .map((a) => a.split('.')[0])
    .join(' ')

const Wrapper = styled.div`
  background: var(--color-trans07);
  padding: 26px;
  border-radius: 10px;
  max-width: 855px;
  margin: auto;
  position: relative;
  min-height: 200px;

  .section-title {
    color: var(--color-black);
    margin-bottom: 15px;
  }
  
  @media (max-width: 767px) {
    padding: 0px;
    background: none;
  }
`

const Auction = styled.div`
  display: flex;
  max-width: 803px;
  border-radius: 6px;
  background-color: var(--color-white);
  color: var(--color-blue2);
  border: 1px solid var(--color-border);
  padding: 25px 16px;
  margin-bottom: 20px;
  @media (max-width: 767px) {
    display: block;
    padding: 20px 12px;
  }
`

const AuctionDetail = styled.div`
  text-align: left;
  margin-left: 40px;

  .detail-info {
    margin-bottom: 19px;

    .label {
      font-size: 14px;
      line-height: 21px;
      text-transform: uppercase;
      font-weight: normal;
      margin-bottom: 2px;
    }

    .value {
      font-size: 18px;
      line-height: 26px;
    }
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

  @media (max-width: 767px) {
    display: block;
    margin-left: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    .detail-info, .actions {
      width: 130px;
      .label {
        font-size: 12px;
      }
  
      .value {
        font-size: 14px;
      }
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
    height: 22px;
    margin-right: 6px;
  }
`

const Remaining = styled.div``

const Graph = styled.div`
  max-width: 560px;
  width: calc(100% - 180px);
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
  @media (max-width: 767px) {
    width: 100%;
    max-width: unset;
  }
`

const RarityTypes = styled.div`
  margin-bottom: 32px;

  .type {
    text-align: left;
    img {
      margin-right: 11px;
    }
    p {
      font-size: 14px;
      font-weight: normal;
    }

    span {
      font-weight: bold;
    }

    a {
      display: inline-block;
      margin-left: 2px;
      font-size: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      &.legendary {
        color: #EDBA31;
        border: 1px solid #EDBA31;
      }
      &.rare, &.common {
        color: var(--color-red2);
        border: 1px solid var(--color-red2);
      }
    }
  }
  .rc-tooltip {
    opacity: 1;
    .rc-tooltip-inner {
      padding: 5px 8px;
      text-align: center;
      text-decoration: none;
      border-radius: 3px;
      min-height: 34px;
      border: none;
      box-shadow: 0px 0px 4px rgba(0,0,0,0.5);
      max-width: 240px;
      color: var(--color-white);
      border-radius: 3px;
      background: linear-gradient(88.78deg, #FFC307 0%, #D78624 100%);
      font-size: 9px;
      line-height: 1;
      font-weight: normal;
    }
    .rc-tooltip-arrow {
      border-top-color: #FAD510;
    }
  }
  
  @media (max-width: 767px) {
    border-radius: 6px;
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    padding: 20px 12px;
    .type {
      img {
        width: 32px;
        height: 32px;
        margin-right: 6px;
      }
      p {
        font-size: 12px;
      }
    }
  }
`

export const AuctionPurchase = styled.div`
  &.auction-info {
    margin-top: 10px;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background-color: var(--color-white);
    color: var(--color-blue2);
    padding: 7px 15px;
    text-align: left;
  }

  &.auction-header {
    border-radius: 12px;
    background-color: var(--color-blue2);
    color: var(--color-white);
    padding: 16px 15px;
    text-transform: uppercase;
  }

  .epoch {
    width: 9%;
  }

  .nft {
    width: 36%;

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
    width: 21%;

    img {
      height: 18px;
      margin-right: 6px;
    }
  }

  .owner {
    width: 10%;
  }

  .rarity {
    width: 15%;

    img {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .duration {
    width: 20%;
  }

  .actions {
    min-width: 20px;

    img {
      height: 13px;
    }
  }

  .font-12 {
    font-size: 12px;
  }
  @media (max-width: 767px) {
    flex-wrap: wrap;
    > div {
      min-width: 25%;
      max-width: 50%;
      width: auto!important;
      padding: 6px;
    }
    &.auction-header {
      display: none;
    }
  }
`


export const Purchase = ({ purchase, onClickPurchase }) => {
  const { id, epoch, /* purchases, start, end,  */amount, timestamp, asset, feePercentage } = purchase
  const rarity = getRarity(feePercentage)
  return (
    <AuctionPurchase className="flex-center auction-info">
      <div className="epoch">
        <div>{epoch}</div>
      </div>
      <div className="flex-center cursor nft" onClick={() => onClickPurchase && onClickPurchase(purchase)}>
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
        <div className={`flex-center`}>
          <img src={rarity.imgSrc} />
          {rarity.name}
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
        <div>{getDate(timestamp)}</div>
      </div>
      <div className="actions flex-all">
        <img src="/assets/arrow-point-to-right.svg" alt="" className="cursor" onClick={() => onClickPurchase && onClickPurchase(purchase)} />
      </div>
    </AuctionPurchase>
  )
}

const CustomTooltip = (props) => {
  const { active, payload } = props
  if (active && payload && payload[0].payload.toolTip) {
    return <div className={`custom-tooltip ${payload[0].payload.className}`}>{payload[0].payload.toolTip}</div>
  }
  return null
}

export default function AuctionList({
  account,
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
  const [auction, setAuction] = useState(null)

  useEffect(() => {
    if (current && (!purchase || offset < 5 || offset % 15 === 0)) {
      // if (purchase && purchase.xPos === xPos) return
      const t1 = parseInt(current.timestamp - now / 1000)
      const max = t1 > 0 ? (current.price / t1) * EPOCH_PERIOD : current.maxY
      const start = lastPurchase ? lastPurchase.amount * 2 : max
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
          toolTip: `Start Price @ ${format(start)}$hrimp`,
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
          toolTip: `End Price @ ${format(current.minY)}$hrimp`,
          current: current.minY,
          className: 'grey',
        },
      ])
    }
  }, [current, lastPurchase, offset])

  return (
    <Wrapper className="auction-list">
      {purchase ? (
        current.price > 0 ? (
          <>
            <Auction>
              <Graph>
                <ResponsiveContainer width="100%" height={240}>
                  <ComposedChart data={data}>
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
                                  {format(purchase.current)}$hrimp
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
              <AuctionDetail>
                <div className="detail-info">
                  <div className="label epoch">Epoch</div>
                  <Epoch className="value epoch">{purchase.epoch}</Epoch>
                </div>
                <div className="detail-info">
                  <div className="label remaining">Remaining Time</div>
                  <Remaining className="value epoch">{duration || '00:00:00'}</Remaining>
                </div>
                <div className="detail-info">
                  <div className="label price">Current Price</div>
                  <Price className="flex-center value epoch">
                    <img src="/assets/$hrimp-token.svg" alt="" />
                    {format(purchase.current || 0)}
                  </Price>
                </div>
                <div className="actions">
                  <button onClick={onPurchase} disabled={purchased || pending || Number(current.price) === 0}>
                    {account ? (allowance > 0 ? 'Purchase' : 'Unlock') : 'Connect Wallet'}
                  </button>
                </div>
              </AuctionDetail>
            </Auction>
            <div>
              <h5 className="section-title">CHANCES OF GETTING NFT RARITY</h5>
              <RarityTypes id="rarity-types">
                <div className="flex justify-around rarity-types">
                  {Object.keys(Rarity).map(key => {
                    const rarity = Rarity[key]
                    return (
                      <div className="type" key={key}>
                        <div className="flex-center">
                          <img src={rarity.imgSrc} alt={rarity.name} />
                          <div>
                            <p className="flex-center">
                              {rarity.name}
                              {/* <ReactTooltip
                                placement="top"
                                overlay={<span>{rarity.description}</span>}
                                getTooltipContainer={() => {
                                  if (document) {
                                    return document.getElementById('rarity-types');
                                  }
                                }}
                              >
                                <a className={`info-tooltip ${rarity.name.toLowerCase()}`}>i</a>
                              </ReactTooltip> */}
                            </p>
                            <span>{rarity.chance}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </RarityTypes>
            </div>
            {lastPurchase && (
              <div>
                <h5 className="section-title">LAST PURCHASED NFT</h5>
                <Purchase purchase={lastPurchase} onClickPurchase={setAuction} />
              </div>
            )}
            {auction && (
              <PurchaseDetail purchase={auction} onClose={() => setAuction(null)} />
            )}
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
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  )
}
