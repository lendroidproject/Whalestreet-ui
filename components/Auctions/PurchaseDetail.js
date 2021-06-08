import React from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'
import { shorten } from 'utils/string'
import { openseaLink, addrLink } from 'utils/etherscan'

const Wrapper = styled.div`
  z-index: 101;

  .portal-content {
    max-width: 623px;
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
  opacity: 0.89;
  background-color: var(--color-black);
  z-index: -1;
`

const Close = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  color: var(--color-red2);
  font-size: 18px;
  letter-spacing: 0.18px;
  line-height: 26px;

  img {
    margin-left: 8px;
  }
`

const Purchase = styled.div`
  border-radius: 12px;
  background-color: var(--color-white);
  color: var(--color-black);
  font-weight: normal;
  font-size: 14px;
  padding: 20px;
  margin-bottom: 30px;
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .owner, .asset {
    margin-bottom: 10px;
  }
  a {
    color: #3D39C9;
  }
`

const OpenseaAccountWrapper = styled.div`
  display: flex;
  align-items: center;
  .avatar {
    width: 30px;
    border-radius: 50%;
    margin-right: 7px;
  }
  .prefix {
    margin-right: 10px;
  }
`

const OpenseaAccount = ({ account: { address, profile_img_url, user }, prefix }) => (
  <OpenseaAccountWrapper>
    <img className="avatar" src={profile_img_url} />
    <span className="prefix">{prefix}</span>
    <a className="bold" href={openseaLink(address)} target="_blank">
      {user?.username || address.substr(2, 6)}
    </a>
  </OpenseaAccountWrapper>
)

const OpenseaAssetWrapper = styled.div`
  display: flex;
  .art {
    width: 220px;
    height: 220px;
    margin-right: 20px;
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  .info {
    width: 343px;
    > div {
      margin-bottom: 15px;
    }
    .desc {
      font-size: 12px;
      letter-spacing: 0;
      line-height: 12px;
    }
    .token > div {
      margin-right: 50px;
    }
    .link {
      span {
        margin-right: 5px;
      }
      a {
        vertical-align: middle;
      }
    }
  }
`

const OpenseaAsset = ({ asset, external }) => (
  <OpenseaAssetWrapper>
    <div className="art">
      <iframe src={asset?.animation_url || asset?.image_preview_url} title={asset.name} />
    </div>
    <div className="info">
      <div className="desc">{asset?.description}</div>
      <div className="flex token">
        <div>
          <p>Contract Address</p>
          <a className="bold" href={addrLink(asset?.asset_contract?.address)}>{shorten(asset?.asset_contract?.address)}</a>
        </div>
        <div>
          <p>Token Id</p>
          <p className="bold">{asset?.token_id}</p>
        </div>
      </div>
      {external && (
        <div className="link">
          <span className="bold">{external}</span>
          <a href={asset?.external_link} target="_blank">
            <img src="/assets/link-icon-blue.svg" />
          </a>
        </div>
      )}
      <div className="link">
        <span className="bold">View On Opensea</span>
        <a href={asset?.permalink} target="_blank"><img src="/assets/link-icon-blue.svg" /></a>
      </div>
    </div>
  </OpenseaAssetWrapper>
)

export default function PurchaseDetail({ purchase, onClose }) {

  return ReactDom.createPortal(
    <Wrapper className="purchase-detail portal fill flex-all">
      <Overlay className="fill" />
      <div className="portal-content">
        <Purchase key={purchase.id}>
          <Close className="uppercase flex-center cursor" onClick={onClose}>
            <img src="/assets/close-button.svg" alt="" />
          </Close>
          <h2 className="title">{purchase?.asset?.name}</h2>
          <div className="owner">
            <OpenseaAccount account={purchase?.asset?.owner} prefix="Owned by" />
          </div>
          <div className="asset">
            <OpenseaAsset asset={purchase.asset} external="View on Artblocks Factory" />
          </div>
          <div className="creator">
            <OpenseaAccount account={purchase?.asset?.creator} prefix="Created by" />
          </div>
        </Purchase>
      </div>
    </Wrapper>,
    document.body
  )
}
