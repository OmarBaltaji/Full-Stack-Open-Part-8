import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import { BrowserRouter } from 'react-router-dom';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
)