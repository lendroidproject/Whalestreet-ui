import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'METAMASK':
      return { ...state, metamask: { ...state.metamask, ...action.payload } }
    case 'INIT_CONTRACTS':
      return { ...state, library: action.payload }
    case 'PAYOUT_CREATED':
      return { ...state, payouts: { ...state.payouts, ...action.payload } }
    default:
      return state
  }
}

const defaults = {
  metamask: {},
  payouts: {},
}

function Store(initialState = defaults) {
  return createStore(reducer, initialState)
}

export default Store
