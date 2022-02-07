import { SERVER } from '../config/global'

export const getShelfs = (filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'GET_SHELFS',
    payload: async () => {
      const response = await fetch(`${SERVER}/virtualShelfs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const addShelf = (shelf, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'ADD_SHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shelf)
      })
      response = await fetch(`${SERVER}/virtualShelfs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const saveShelf = (id, shelf, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'SAVE_SHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shelf)
      })
      response = await fetch(`${SERVER}/virtualShelfs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      return data
    }
  }
}

export const deleteShelf = (id, filterString, page, pageSize, sortField, sortOrder) => {
  return {
    type: 'DELETE_SHELF',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/virtualShelfs?${filterString}&sortField=${sortField || ''}&sortOrder=${sortOrder || ''}&page=${page || ''}&pageSize=${pageSize || ''}`)
      const data = await response.json()
      console.log(data)
      return data
    }
  }
}

export const getBooks = (id) => {
  return {
    type: 'GET_BOOKS',
    payload: async () => {
      const response = await fetch(`${SERVER}/virtualShelfs/${id}/books`)
      const data = await response.json()
      console.log(data)
      return data
      
    }
  }
}
export const addBook = (book,id) => {
  return {
    type: 'ADD_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs/${id}/books`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
      })
      response = await fetch(`${SERVER}/virtualShelfs/${id}/books`)
      const data = await response.json()
      return data
    }
  }
}
export const saveBook = (id, shelf, idShelf) => {
  return {
    type: 'SAVE_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs/${idShelf}/books/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shelf)
      })
      response = await fetch(`${SERVER}/virtualShelfs/${idShelf}/books`)
      const data = await response.json()
      return data
    }
  }
}
export const deleteBook = (id, idShelf) => {
  return {
    type: 'DELETE_BOOK',
    payload: async () => {
      let response = await fetch(`${SERVER}/virtualShelfs/${idShelf}/books/${id}`, {
        method: 'delete'
      })
      response = await fetch(`${SERVER}/virtualShelfs/${idShelf}/books`)
      const data = await response.json()
      console.log(data)
      return data
    }
  }
}
export function postData(data) {
  return {
      type: "POST_DATA",
      payload: async () => {
          let response = await fetch(`${SERVER}/import`, {
              method: 'post',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
      }
  }
}


export function getData() {
  return {
      type: "GET_DATA",
      payload: async () => {
          const response = await fetch(`${SERVER}/export`)
          const data = await response.json()
          return data
      }
  }
}



