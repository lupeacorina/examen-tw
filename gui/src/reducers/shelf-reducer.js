const INITIAL_STATE = {
  shelfList: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export default function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GET_SHELFS_PENDING':
    case 'ADD_SHELF_PENDING':
    case 'SAVE_SHELF_PENDING':
    case 'DELETE_SHELF_PENDING':
      return { ...state, error: null, fetching: true, fetched: false }
    case 'GET_SHELFS_FULFILLED':
    case 'ADD_SHELF_FULFILLED':
    case 'SAVE_SHELF_FULFILLED':
    case 'DELETE_SHELF_FULFILLED':
      return { ...state, shelfList: action.payload.records, count: action.payload.count, error: null, fetching: false, fetched: true }
    case 'GET_SHELFS_REJECTED':
    case 'ADD_SHELF_REJECTED':
    case 'SAVE_SHELF_REJECTED':
    case 'DELETE_SHELF_REJECTED':
      return { ...state, shelfList: [], error: action.payload, fetching: false, fetched: true }
    default:
      return state
  }
}
