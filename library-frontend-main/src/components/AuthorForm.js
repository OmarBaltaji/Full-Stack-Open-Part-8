import { useMutation } from '@apollo/client';
import React, { useState } from 'react'
import ALL_AUTHORS from '../graphql/queries/allAuthors';
import EDIT_AUTHOR from '../graphql/mutations/editAuthor';

const AuthorForm = ({ authors }) => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n');
      console.log(messages, error);
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map(author => author.name === name ? response.data.editAuthor : author)
        }
      })
    } 
  });

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  
  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: parseInt(birthYear) } });

    setName('');
    setBirthYear('');
  }

  return (
    <div>
      <h3>Edit Author Birth Year</h3>
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <select onChange={({ target }) => setName(target.value)} value={name}>
            <option value={''}></option>
            {authors.map(author => <option key={author.id} value={author.name}>{author.name}</option>)}
          </select>
        </div>
        <div>
          <label>Birth Year</label>
          <input type='number' value={birthYear} onChange={({ target }) => setBirthYear(target.value)} />
        </div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AuthorForm