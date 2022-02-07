import { useEffect, useState } from 'react'
import './BookList.css';
import { useSelector, useDispatch } from 'react-redux'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import Select from 'react-select'
import { Dropdown } from 'primereact/dropdown'


import { getBooks,addBook,saveBook,deleteBook } from '../actions'

const bookSelector = state => state.book.bookList


 


function BookList () {
  const id=localStorage.id
  

  const [isDialogShown, setIsDialogShown] = useState(false)
  const [titlu, setTitlu] = useState('')
  const [url, setURL] = useState('')
  const [genLiterar, setGenLitear] = useState('COMEDY')
 const options=[{ value: 'COMEDY', label: 'COMEDY' },{ value: 'TRAGEDY', label: 'TRAGEDY' }]



  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedBook, setSelectedBook] = useState(null)
  


 



const dispatch = useDispatch()
const books = useSelector(bookSelector)





useEffect(() => {
 dispatch(getBooks(localStorage.id))

}, [])

  

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setTitlu('')
    setURL('')

  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    let id=localStorage.id
    if (isNewRecord) {
        
      dispatch(addBook({ titlu, genLiterar,url },id))
    } else {
      dispatch(saveBook(selectedBook, { titlu, genLiterar,url },id))
      
    }

    setIsDialogShown(false)
    setSelectedBook(null)
    setTitlu('')
    setGenLitear('COMEDY')
  }

  const editBook = (rowData) => {
    setSelectedBook(rowData.id)
    setTitlu(rowData.titlu)
    setGenLitear((rowData.genLiterar))//?
    setURL(rowData.url)
  
    
    setIsDialogShown(true)
    setIsNewRecord(false)
    
  }
  

  const handleDeleteBook = (rowData) => {
      
    dispatch(deleteBook(rowData.id,id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' onClick={handleSaveClick} />
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <>
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editBook(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteBook(rowData)} />
        
      </>
    )
  }

  

  return (
    <div className="wrapper">
      <DataTable 
      style={{
        height: "550px",
      }}
      value={books}
      
      

        footer={tableFooter}
       
        
       
      >
        <Column header='Titlu' field='titlu'  />
        <Column header='Gen literar' field='genLiterar'  />
        <Column header='Url' field='url'  />
       
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='A book' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='titlu' onChange={(evt) => setTitlu(evt.target.value)} value={titlu} />
        </div>
        <div>
          <InputText placeholder='url' onChange={(evt) => setURL(evt.target.value)} value={url} />
        </div>
        <div>
          
          <Dropdown
         value={genLiterar}
         options={options}
         onChange={(e)=>{
           const newGen=e.value
           setGenLitear(newGen)
         }}
         >
          
         </Dropdown>
          
        </div>
        
      </Dialog>
      
    

    </div>
  )
}

export default BookList

