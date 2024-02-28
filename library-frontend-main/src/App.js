import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Recommended from './components/Recommended'
import { useQuery, useSubscription } from '@apollo/client';
import ALL_BOOKS from './graphql/queries/allBooks';
import ALL_AUTHORS from './graphql/queries/allAuthors';
import BOOK_ADDED from './graphql/subscriptions/bookAdded';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { updateCache } from './components/cache/books'

if (process.env.NODE_ENV !== 'production') {  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('book-author-token') || '');
  const [genre, setGenre] = useState('');
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  });
  const authorsResult = useQuery(ALL_AUTHORS);

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      // When accessing the query from the cache, the variable needs to be the same as the one cached 
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre } }, addedBook)
    }
  })

  if (booksResult.loading || authorsResult.loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <Navbar setToken={setToken} token={token} />

      <div className='container'>
        <Routes>
          <Route path='/' element={<Authors authors={authorsResult.data.allAuthors} />} ></Route>
          <Route path='/books' element={<Books books={booksResult.data.allBooks} setGenre={setGenre} genre={genre} />} ></Route>
          <Route path='/books/add' element={<NewBook token={token} />} ></Route>
          <Route path='/login' element={<LoginForm setToken={setToken} token={token} />} ></Route>
          <Route path='/recommended' element={<Recommended token={token} />} ></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
