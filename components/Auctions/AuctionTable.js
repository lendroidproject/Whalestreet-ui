import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AuctionDetail, { DetailEpoc, getDate } from './AuctionDetail'

const Wrapper = styled.div`
  max-width: 788px;
  margin: 0 auto 30px;

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

const PurchasedEpoc = styled(DetailEpoc)`
  background-color: var(--color-black);
  color: var(--color-white);
`

const Duration = styled.div``

export default function AuctionTable({ purchases }) {
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
      {purchases.map(({ id, epoch, purchases, amount, timestamp }) => (
        <Auction key={id} className="flex">
          <div className="epoc">
            <PurchasedEpoc>{epoch}</PurchasedEpoc>
          </div>
          <div className="purchases">{purchases.length}</div>
          <div className="starting">{amount.toFixed(2)}</div>
          <div className="ending">{amount.toFixed(2)}</div>
          <div className="duration">
            <Duration>{getDate(timestamp)}</Duration>
          </div>
          <div className="actions flex-all">
            <img src="/assets/arrow-point-to-right.svg" alt="" className="cursor" onClick={() => setAuction(id)} />
          </div>
        </Auction>
      ))}
      {auction && (
        <AuctionDetail auction={purchases.find((item) => item.id === auction)} onClose={() => setAuction(null)} />
      )}
    </Wrapper>
  )
}
