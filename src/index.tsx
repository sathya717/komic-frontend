import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import ClientProvider from './ClientProvider';
import AuthProvider from './Context/AuthContext';

ReactDOM.render(
  <Router>
    <ClientProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClientProvider>
  </Router>,
  document.getElementById('root')
);
