import React from "react";

const Books = ({ books, setGenre, genre }) => {
  const genres = [];
  books.forEach(book => {
    book.genres.forEach(g => {
      if (!genres.includes(g)) {
        genres.push(g);
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
        <button onClick={() => setGenre('')}>Clear genre</button>
      </div>
    </div>
  )
}

export default Books
