import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { debounce } from 'debounce';
import slugify from 'limax';
import { withRouter } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';

import RegisterInput from './RegisterInput';

const Form = styled.form`
  margin-top: 25px;
  padding: 5px 30px;
  text-align: initial;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Label = styled.label`
  display: block;
  font-size: 0.7rem;
  font-style: italic;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  margin: 20px 0px;
  background-color: #000;
  color: #fff;
  font-size: 0.9rem;
  border: none;
  outline: none;
  font-weight: bold;
  border-radius: 50px;
  text-align: center;
  cursor: pointer;
`;

const CheckButton = styled.a`
  text-decoration: none;
  color: #000;
  font-style: italic;
  font-weight: 500;
  font-size: 0.5rem;
  cursor: pointer;
`;

const ErrorLabel = styled(Label)`
  color: #f15f59;
  margin-bottom: 10px;
`;

const Loader = styled.div`
  margin-top: 20px;
  border: 16px solid #000; /* Light grey */
  border-top: 16px solid #fff; /* Blue */
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

interface values {
  email?: string;
  username?: string;
  password?: string;
  url?: string;
}

interface Error {
  msg?: string;
  field?: string;
}

interface Errors {
  username?: Error;
  password?: Error;
  email?: Error;
  url?: Error;
}

function RegisterForm({ history }) {
  const [values, setValues] = useState<values>({
    email: '',
    username: '',
    password: '',
    url: '',
  });

  const setUser = useContext(AuthContext).setUser;
  const token = useContext(AuthContext).token;

  const [isTouched, setIsTouched] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [createAccount, { loading }] = useMutation(CREATE_USER_MUTATION, {
    onError: (err) => {
      const errs = err.graphQLErrors[0].extensions.errors;
      console.log(errs);
      setErrors(errs);
      // console.log(errors);
    },
    onCompleted: (data) => {
      const account = data.createAccount;
      const { token, profile } = account;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(profile));
      setUser(token, profile);
      history.push('/');
    },
  });

  const handleChange = (e) => {
    if (e.target.name === 'username' && !isTouched) {
      const urlSlug = slugify(e.target.value);
      setValues({
        ...values,
        username: e.target.value,
        url: urlSlug,
      });
    } else if (e.target.name === 'url') {
      setValues({
        ...values,
        url: e.target.value,
      });
    } else
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount({ variables: { ...values } });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>Email</Label>
      <RegisterInput
        error={errors.email ? true : false}
        type='email'
        placeholder='Email Address'
        name='email'
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <ErrorLabel>{errors.email.msg}</ErrorLabel>}
      <Label>Username</Label>
      <RegisterInput
        error={errors.username ? true : false}
        type='text'
        placeholder='Username'
        name='username'
        value={values.username}
        onChange={handleChange}
      />
      {errors.username && <ErrorLabel>{errors.username.msg}</ErrorLabel>}
      <Label>komico.wtf/</Label>
      <RegisterInput
        error={errors.url ? true : false}
        type='text'
        placeholder='url'
        name='url'
        value={values.url}
        onChange={handleChange}
        onClick={() => {
          if (!isTouched) setIsTouched(true);
        }}
      />
      {errors.url && <ErrorLabel>{errors.url.msg}</ErrorLabel>}
      <Label>Password</Label>
      <RegisterInput
        error={errors.password ? true : false}
        type='password'
        placeholder='Password'
        name='password'
        value={values.password}
        onChange={handleChange}
      />
      {errors.password && <ErrorLabel>{errors.password.msg}</ErrorLabel>}
      <ButtonContainer>
        {loading ? <Loader /> : <CreateButton>{'Create Account'}</CreateButton>}
      </ButtonContainer>
    </Form>
  );
}

const FETCH_URL_AVAILABILITY = gql`
  query checkUserSlugAvailability($url: String!) {
    checkUserSlugAvailability(url: $url) {
      code
      message
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation createAccount(
    $username: String!
    $password: String!
    $email: String!
    $url: String!
  ) {
    createAccount(
      userDetails: {
        username: $username
        password: $password
        email: $email
        url: $url
      }
    ) {
      token
      profile {
        id
        user {
          id
          username
          confirmed
          createdAt
          urlSlug {
            id
            url
            createdAt
          }
          avatar
        }
      }
    }
  }
`;

export default withRouter(RegisterForm);
