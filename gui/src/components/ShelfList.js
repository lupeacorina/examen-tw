import './ShelfList.css';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import{useNavigate} from "react-router";

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import { getShelfs, addShelf, saveShelf, deleteShelf } from '../actions'

const shelfSelector = state => state.shelf.shelfList
const shelfCountSelector = state => state.shelf.count

function ShelfList () {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const navigate=useNavigate();
  const [descriere, setDescriere] = useState('')
  
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedShelf, setSelectedShelf] = useState(null)
  const [filterString, setFilterString] = useState('')

 
  const [dataCreare, setDataCreare] = useState(new Date())
 

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const [filters, setFilters] = useState({
    descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dataCreare: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
      descriere: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dataCreare: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  const shelfs = useSelector(shelfSelector)
  const count = useSelector(shelfCountSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getShelfs(filterString, page, 2, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setDescriere('')
   
    setDataCreare(new Date())
   

  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }
  const setBookShelf= async(rowData) => {
    localStorage.id=rowData.id;
        navigate(`/BookList`)
    
  }
  const handleSaveClick = () => {
    // setDataCreare(new Date().toLocaleString())
    if (isNewRecord) {
    
      dispatch(addShelf({ descriere,dataCreare}))
    } else {
      dispatch(saveShelf(selectedShelf, { descriere, dataCreare }))
      
    }

    setIsDialogShown(false)
    setSelectedShelf(null)
    setDescriere('')
    setDataCreare(new Date())
    
  }

  const editShelf = (rowData) => {
    setSelectedShelf(rowData.id)
    setDescriere(rowData.descriere)

   
    setDataCreare(rowData.dataCreare)
    
    
    setIsDialogShown(true)
    setIsNewRecord(false)
    
  }
  const importData=()=>{
    navigate(`/DataList`)
  }

  const handleDeleteShelf = (rowData) => {
    dispatch(deleteShelf(rowData.id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
      <Button label='Import/Export' icon='pi pi-file-o' onClick={() => importData()} />
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
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editShelf(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteShelf(rowData)} />
        <Button label='Books' icon='pi pi-search-plus' onClick={() => setBookShelf(rowData)} />
        
        
      
      </>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 2)
  }

  const handleSort = (evt) => {
    console.warn(evt)
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  return (
    <div className="wrapper">
      <DataTable
        
        value={shelfs}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={2}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header='Descriere' field='descriere' filter filterField='descriere' filterPlaceholder='filter by descriere' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
       
        <Column header='Data creare' field='dataCreare' filter filterField='dataCreare' filterPlaceholder='filter by dataCreare' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable  />
        
       
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='A virtual shelf' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='descriere' onChange={(evt) => setDescriere(evt.target.value)} value={descriere} />
        </div>
        <div>
                    <InputText name="dataCreare" placeholder="DataCreare" type={"date"} value={dataCreare} onChange={(evt) => setDataCreare(evt.target.value)} />
          </div>
        
        
      </Dialog>
    </div>
  )
}

export default ShelfList
