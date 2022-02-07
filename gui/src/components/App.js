import ShelfList from './ShelfList'
import BookList from './BookList'
import{BrowserRouter,Routes,Route} from 'react-router-dom';
import DataList from './DataList';
import './App.css';
function App () {
  return (
    <div className="App">
      <header className="App-header">       
        Corina Lupea
        </header>
    <BrowserRouter>
  <Routes>
 
    <Route path="/" element={<ShelfList />}/>
    
    {<Route path="/BookList" element={<BookList />}/>}
    {<Route path="/DataList" element={<DataList />}/>}
    
   
  </Routes>
  </BrowserRouter>
  </div>
  )
}

export default App
