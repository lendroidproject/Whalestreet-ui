import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AuctionDetail from './AuctionDetail'

const Wrapper = styled.div`
  max-width: 788px;
  margin: 0 auto 30px;

  .epoc {
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
    }
  }
`

const Header = styled.div`
  border-radius: 12px;
  background-color: var(--color-blue);
  color: var(--color-white);
  padding: 14px 10px;
  text-transform: uppercase;
`

const Auction = styled.div`
  margin-top: 10px;
  border-radius: 12px;
  background-color: var(--color-white);
  color: var(--color-black);
  padding: 13px 10px;
`

const Epoc = styled.div`
  font-size: 17px;
  line-height: 17px;
  margin: auto;

  height: 26px;
  width: 26px;
  background-color: var(--color-black);
  border-radius: 50%;
  color: var(--color-white);
`
const Duration = styled.div``

function getDuration(start, end) {
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  let duration = parseInt((endTime - startTime) / 1000)
  const seconds = `00${duration % 60}`.slice(-2)
  duration = (duration - (duration % 60)) / 60
  const mins = `00${duration % 60}`.slice(-2)
  const hours = `00${(duration - (duration % 60)) / 60}`.slice(-2)
  return `${hours}:${mins}:${seconds}`
}

export default function AuctionTable({ auctions }) {
  const [auction, setAuction] = useState(null)
  useEffect(() => {
    setAuction(null)
  }, [])

  return (
    <Wrapper className="auction-table">
      <Header className="flex">
        <div className="epoc">Epoc</div>
        <div className="purchases">Purchases</div>
        <div className="starting">Starting Price</div>
        <div className="ending">Ending Price</div>
        <div className="duration">Time</div>
        <div className="actions" />
      </Header>
      {auctions.map(({ id, epoc, purchaes, price, finalPrice, createdAt, completedAt }) => (
        <Auction key={id} className="flex">
          <div className="epoc">
            <Epoc className="flex-all">{epoc}</Epoc>
          </div>
          <div className="purchases">{purchaes}</div>
          <div className="starting">{price.toFixed(2)}</div>
          <div className="ending">{finalPrice.toFixed(2)}</div>
          <div className="duration">
            <Duration>{getDuration(createdAt, completedAt)}</Duration>
          </div>
          <div className="actions flex-all">
            <img src="/assets/arrow-point-to-right.svg" alt="" className="cursor" onClick={() => setAuction(id)} />
          </div>
        </Auction>
      ))}
      {auction && (
        <AuctionDetail auction={auctions.find((item) => item.id === auction)} onClose={() => setAuction(null)} />
      )}
    </Wrapper>
  )
}
