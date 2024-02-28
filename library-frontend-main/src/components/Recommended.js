import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ME from '../graphql/queries/me';
import ALL_BOOKS from '../graphql/queries/allBooks';

const Recommended = ({ token }) => {
  const navigate = useNavigate();
  const userResult = useQuery(ME);
  const bookResult = useQuery(ALL_BOOKS, {
    variables: { genre: userResult.data?.me.favoriteGenre }
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  if (bookResult.loading || userResult.loading) {
    return <div>Loading recommended books...</div>
  }

  const books = bookResult.data.allBooks;

  return (
    <div>
      <h2>Recommended</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended