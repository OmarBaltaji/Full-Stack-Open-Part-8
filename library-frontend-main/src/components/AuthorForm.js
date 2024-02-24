import { useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const AuthorForm = ({ authors }) => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
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