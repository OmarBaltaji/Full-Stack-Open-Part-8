import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Navbar />

      <div className='container'>
        <Routes>
          <Route path='/' element={<Authors />} ></Route>
          <Route path='/books' element={<Books />} ></Route>
          <Route path='/books/add' element={<NewBook />} ></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
