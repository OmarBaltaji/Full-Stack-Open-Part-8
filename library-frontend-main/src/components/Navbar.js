import React from 'react'
import { Link } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const Navbar = ({ token, setToken }) => {
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.clear();
    client.resetStore();
    setToken(null);
  }

  return (
    <nav style={{ backgroundColor: '#40434E', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link className='nav-item' to='/'>Authors</Link>
        <Link className='nav-item' to='/books'>Books</Link>
        {token && 
          <>
            <Link className='nav-item' to='/books/add'>Add book</Link>
            <Link className='nav-item' to='/recommended'>Recommended</Link>
          </>
        }
      </div>
      <div>
        {token 
        ? <Link className='nav-item' onClick={handleLogout}>Logout</Link>
        : <Link className='nav-item' to='/login'>Login</Link>
        }
      </div>
    </nav>
  )
}

export default Navbar