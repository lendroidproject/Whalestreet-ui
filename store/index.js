import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'WALLET': {
      return {
        ...state,
        wallet: action.payload[0],
        connectWallet: action.payload[1],
      }
    }
    case 'ACCOUNT': {
      return {
        ...state,
        account: action.payload,
      }
    }
    case 'LIBRARY': {
      return {
        ...state,
        [action.payload[0]]: action.payload[1],
      }
    }
    case 'INFO': {
      return {
        ...state,
        info: action.payload,
      }
    }
    case 'POOL_INFO': {
      return {
        ...state,
        poolInfo: action.payload,
      }
    }
    case 'AUCTION_INFO': {
      return {
        ...state,
        auctionInfo: action.payload,
      }
    }
    default:
      return state
  }
}

const defaults = {}

function Store(initialState = defaults) {
  return createStore(reducer, initialState)
}

export default Store
