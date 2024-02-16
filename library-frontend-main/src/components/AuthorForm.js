import { useMutation } from '@apollo/client';
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const AuthorForm = () => {
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
          <input type='text' onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          <label>Birth Year</label>
          <input type='number' onChange={({ target }) => setBirthYear(target.value)} />
        </div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AuthorForm