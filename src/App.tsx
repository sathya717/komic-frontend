import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from './Context/AuthContext';

import Router from './Router';
import NavBar from './components/NavBar';

import './App.css';

const StyledButton = styled.button`
  border: none;
  background-color: #000;
  color: #fff;
  padding: 10px 25px;
  margin: 10px;
  cursor: pointer;
`;

function App() {
  const fetchTokenFromStorage = useContext(AuthContext).fetchTokenFromStorage;

  useEffect(() => {
    fetchTokenFromStorage();
  }, []);

  return (
    <div>
      <NavBar />
      <Router />
    </div>
  );
}

export default App;
