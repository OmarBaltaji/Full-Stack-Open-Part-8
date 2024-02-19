import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-author-token') || '');
  
  return (
    <div>
      <Navbar setToken={setToken} token={token} />

      <div className='container'>
        <Routes>
          <Route path='/' element={<Authors />} ></Route>
          <Route path='/books' element={<Books />} ></Route>
          <Route path='/books/add' element={<NewBook token={token} />} ></Route>
          <Route path='/login' element={<LoginForm setToken={setToken} token={token} />} ></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
