import React from "react";
import AuthorForm from "./AuthorForm";

const Authors = ({ authors }) => {
  return (
    <div>
      <h2>Authors</h2>
      <table className="authors-table">
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorForm authors={authors} />
    </div>
  )
}

export default Authors
