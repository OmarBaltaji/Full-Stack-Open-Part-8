import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react'
import LOGIN from '../graphql/mutations/login';
import { useNavigate  } from 'react-router-dom';

const LoginForm = ({ token, setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    }
  });
  const navigate = useNavigate();
  
  const submit = (event) => {
    event.preventDefault();

    login({ variables: { username, password } });

    setUsername('');
    setPassword('');
  }

  useEffect(() => {
    if (result.data) {
      const tokenResult = result.data.login.value; 
      localStorage.setItem('book-author-token', tokenResult)
      setToken(tokenResult);
    }
  }, [result.data]);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input value={username} onChange={({ target }) => setUsername(target.value)}  />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={({ target }) => setPassword(target.value)}  />
        </div>

        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm