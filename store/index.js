import { createStore } from 'redux'

const reducer = (state, action) => {
  switch (action.type) {
    case 'METAMASK':
      return { ...state, metamask: { ...state.metamask, ...action.payload } }
    case 'INIT_CONTRACTS':
      return { ...state, library: action.payload }
    case 'STAKED':
    case 'UNSTAKED':
    case 'REWARDCLAIMED':
      return { ...state, transactions: { ...state.transactions, ...action.payload } }
    default:
      return state
  }
}

const defaults = {
  metamask: {},
  transactions: {},
}

function Store(initialState = defaults) {
  return createStore(reducer, initialState)
}

export default Store
