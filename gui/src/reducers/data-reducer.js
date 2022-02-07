const INITIAL_STATE = {
    dataList: [],
    error: null,
    fetching: false,
    fetched: false
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_DATA_PENDING":
        case "POST_DATA_PENDING":
            return { ...state, error: null, fetching: true, fetched: false }
        case "GET_DATA_FULFILLED":
        case 'POST_DATA_FULFILLED':
            return { ...state, dataList: action.payload, fetching: false, fetched: true }
        case "GET_DATA_REJECTED":
        case 'POST_DATA_REJECTED':
            return { ...state, error: action.payload, fetching: false, fetched: false }
        default:
            return state
    }
}
