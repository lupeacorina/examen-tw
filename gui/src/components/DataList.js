import { useSelector, useDispatch } from "react-redux"
import React, { useEffect, useState } from "react"

import './DataList.css';
import { getData, postData } from "../actions"

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';


const dataSelector = state => state.data.dataList

function DataList() {
    const dispatch = useDispatch()
    const data = useSelector(dataSelector)
  

    const [exportedData, setExportedData] = useState("")//export
    const [importedData, setImportedData] = useState("")//import


    useEffect(() => {
        dispatch(getData())
    }, [])

    
    const importDataList = () => {
       
        dispatch(postData(JSON.parse(importedData)))
        setImportedData("")
        console.log(importedData)
        console.log(exportedData)
        
    }

    
    const exportDataList = () => {
        setExportedData(JSON.stringify(data))
    }


    return (
        <div className="wrapper">
            

            <div>
               
                
                
          <InputTextarea  placeholder='import' onChange={(evt) => setImportedData(evt.target.value)} value={importedData} />
          <Button label="Import" className="pi pi-file-o" onClick={() => importDataList()} />
        
            </div>
            <div>
                
                
                    <InputTextarea  placeholder='export'  value={exportedData} />
                    <Button label="Export" className="pi pi-file-o" onClick={() => exportDataList()} />
               
            </div>

        </div>
    )
}

export default DataList