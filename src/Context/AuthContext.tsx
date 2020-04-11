import React, { createContext, useReducer } from 'react';
import authReducer from './AuthReducer';

interface AuthState {
  token: string | null;
  user: object | null;
  setUser?: CallableFunction;
  fetchTokenFromStorage?: CallableFunction;
}

const initState: AuthState = {
  token: null,
  user: null,
};

export const AuthContext = createContext(initState);

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initState);

  const setUser = (token, user) => {
    dispatch({
      type: 'SET_USER',
      payload: { token, user },
    });
  };

  const fetchTokenFromStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user)
      dispatch({
        type: 'SET_USER',
        payload: { token, user },
      });
  };

  return (
    <AuthContext.Provider value={{ ...state, setUser, fetchTokenFromStorage }}>
      {children}
    </AuthContext.Provider>
  );
}
