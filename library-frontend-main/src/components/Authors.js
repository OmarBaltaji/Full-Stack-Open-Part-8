import React from "react";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import AuthorForm from "./AuthorForm";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>Loading authors...</div>
  }

  const authors = result.data.allAuthors;

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

      <AuthorForm />
    </div>
  )
}

export default Authors
