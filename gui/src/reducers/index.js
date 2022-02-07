import { combineReducers } from 'redux'
import shelf from './shelf-reducer'
import book from './book-reducer'
import data from './data-reducer'

export default combineReducers({
  shelf,book,data
})
