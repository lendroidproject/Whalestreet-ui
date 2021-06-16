import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import qs from 'qs';
import Spinner from 'components/common/Spinner'
import { getAssets } from 'utils/api'

import custom98CSS from './custom-98css'
import adminAssets from './admin-assets'


const Wrapper = styled.div`
${custom98CSS}
.bg {
  background: #F0F0F0;
}
`

const HomeWrapper = styled.div`
  width: 1016px;
  margin: auto;
  .window-menu {
    button {
      margin-right: 28px;
      position: relative;
      z-index: 1;
      padding: 12px 14px;
      color: var(--color-black);
    }
    button.active {
      color: #06157F;
      &:after {
        content: '';
        position: absolute;
        box-shadow: 0px 0px 3px 1px rgb(31 31 31);
        width: calc(100% - 3px);
        height: 0px;
        left: 2px;
        top: 100%;
        z-index: -1;
      }
    }
    button.inactive {
      background: none;
      box-shadow: none;
    }
  }
  .window-content {
    min-height: 450px;
    padding: 25px;
  }
  .asset-list {
    display: flex;
    flex-wrap: wrap;

    .asset-list-item {
      text-align: center;
      outline: none;
      text-decoration: none;
      img {
        width: 130px;
        height: 130px;
      }
      p {
        font-size: 12px;
        line-height: 17px;
        font-weight: bold;
        color: var(--color-black);
      }
    }
  }
`

export default connect((state) => state)(function Home({ wallet, library, eventTimestamp }) {
  const filters = [
    {
      key: null,
      title: 'New',
    },
    {
      key: false,
      title: 'Activated',
    },
    {
      key: true,
      title: 'Archived',
    },
  ]

  const [selectedFilter, setSelectedFilter] = useState(filters[0])
  const [data, setData] = useState(null)
  const [assets, setAssets] = useState([])
  const loading = !data
  const loadData = () => {
    Promise.all([
    ])
      .then(
        ([
        ]) => {
          console.log({
          })
          setData({
          })
        }
      )
      .catch(console.log)
  }
  useEffect(() => {
    if (library && !data && wallet.address) {
      loadData()
    }
  }, [library, data, wallet])
  useEffect(() => {
    if (eventTimestamp && data && eventTimestamp > data.timestamp) {
      loadData()
    }
  }, [eventTimestamp, data])

  useEffect(() => {
    const tokenAssets = wallet.network === 1 ? adminAssets[wallet.network] : adminAssets[4]
    if (tokenAssets && tokenAssets.length) {
      const queryAssets = async function () {
        try {
          const result = await getAssets(
            {
              token_ids: tokenAssets.map(({ tokenId }) => tokenId),
              asset_contract_addresses: tokenAssets.map(({ tokenAddress }) => tokenAddress),
              limit: 50,
              offset: 0
            },
            {
              paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
              }
            }
          )
          if (result?.data?.assets) {
            const assets = result.data.assets.map(asset => {
              const matching = tokenAssets.find((e) => (e.tokenId === asset.token_id && e.tokenAddress === asset?.asset_contract_addresses?.address))
              asset.archived = matching ? matching.archived : false
              return asset
            })
            setAssets(assets)
          }
        } catch (err) {
          console.log(err)
        }
      }
      queryAssets()
    }
  }, [wallet.network])

  if (loading) return <Spinner />

  const fileteredAssets = selectedFilter.key !== null ? assets.filter(asset => asset.archived === selectedFilter.key) : assets

  return (
    <Wrapper>
      <div className="bg flex-all"></div>
      <HomeWrapper className="window">
        <div className="title-bar">
          <div className="title-bar-text">
            WhaleSwap Admin
          </div>
        </div>
        <div className="window-body">
          <div className="window-menu">
            {filters.map((filter, idx) => (
              <button key={idx} className={filter.key === selectedFilter.key ? 'active' : 'inactive'} onClick={() => setSelectedFilter(filter)}>
                {filter.title}
              </button>
            ))}
          </div>
          <div className="window-content">
            <div className="asset-list">
              {fileteredAssets.map((asset, idx) => (
                <a className="asset-list-item" key={idx} href="#" target="_blank">
                  <img src={asset.image_url} alt={asset.name} />
                  <p>{asset.name}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="flex window-footer">
            <div className="window-footer-panel" style={{ width: '75%' }}></div>
            <div className="window-footer-panel" style={{ width: '15%' }}></div>
            <div className="window-footer-panel" style={{ width: '10%' }}></div>
          </div>
        </div>
      </HomeWrapper>
    </Wrapper>
  )
})


