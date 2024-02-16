import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const AuthorForm = () => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
  });
  const result = useQuery(ALL_AUTHORS);

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  
  const submit = (event) => {
    event.preventDefault();

    editAuthor({ variables: { name, setBornTo: parseInt(birthYear) } });

    setName('');
    setBirthYear('');
  }

  if (result.loading) {
    return <div>Loading authors...</div>
  }

  const authors = result.data.allAuthors;

  return (
    <div>
      <h3>Edit Author Birth Year</h3>
      <form onSubmit={submit}>
        <div>
          <label>Name</label>
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map(author => <option key={author.id} value={author.name}>{author.name}</option>)}
          </select>
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