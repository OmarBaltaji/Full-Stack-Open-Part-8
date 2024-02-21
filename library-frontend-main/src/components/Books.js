import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const [genre, setGenre] = useState('');
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  });

  if (result.loading) {
    return <div>Loading books...</div>
  }
  
  let books = result.data.allBooks;
  const genres = [];
  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    })
  });

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="genres-container">
        {genres.map(g => <button key={g} className={g === genre ? 'active' : ''} onClick={() => setGenre(g)}>{g}</button>)}
        <button onClick={() => setGenre('')}>Clear Genre</button>
      </div>
    </div>
  )
}

export default Books
