import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from './queries';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

if (process.env.NODE_ENV !== 'production') {  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-author-token') || '');
  const [genre, setGenre] = useState('');
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  });

  if (result.loading) {
    return <div>Loading books...</div>
  }
  
  return (
    <div>
      <Navbar setToken={setToken} token={token} />

      <div className='container'>
        <Routes>
          <Route path='/' element={<Authors />} ></Route>
          <Route path='/books' element={<Books books={result.data.allBooks} setGenre={setGenre} genre={genre} />} ></Route>
          <Route path='/books/add' element={<NewBook token={token} favoriteGenre={genre} />} ></Route>
          <Route path='/login' element={<LoginForm setToken={setToken} token={token} />} ></Route>
          <Route path='/recommended' element={<Recommended token={token} />} ></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
