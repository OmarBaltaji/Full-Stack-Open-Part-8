import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav style={{ backgroundColor: '#40434E', padding: '15px' }}>
      <Link className='nav-item' to='/'>Authors</Link>
      <Link className='nav-item' to='/books'>Books</Link>
      <Link className='nav-item' to='/books/add'>Add book</Link>
    </nav>
  )
}

export default Navbar