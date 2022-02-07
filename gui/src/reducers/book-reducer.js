const INITIAL_STATE = {
    bookList: [],
    error: null,
    fetching: false,
    fetched: false,
    count:0,
 
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_BOOKS_PENDING":
        case "ADD_BOOK_PENDING":
        case "SAVE_BOOK_PENDING":
        case 'DELETE_BOOK_PENDING':
            return { ...state, error: null, fetching: true, fetched: false }
        case "GET_BOOKS_FULFILLED":
        case "ADD_BOOK_FULFILLED":
        case "SAVE_BOOK_FULFILLED":
        case 'DELETE_BOOK_FULFILLED':
            return { ...state, bookList: action.payload, count:action.payload.count,error:null,fetching: false, fetched: true }
        case "GET_BOOKS_REJECTED":
        case "ADD_BOOK_REJECTED":
        case "SAVE_BOOK_REJECTED":
        case 'DELETE_BOOK_REJECTED':
            return { ...state, error: action.payload, fetching: false, fetched: false }
        default:
            return state
    }
}


