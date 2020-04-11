import React from 'react';
import styled from 'styled-components';

interface InputStyleProps {
  color?: string;
}

const Input = styled.input<InputStyleProps>`
  margin: 5px 0px;
  padding: 10px 20px;
  width: 100%;
  outline: none;
  background-color: #f9f9f9;
  border: 1px solid ${(props) => (props.color ? props.color : '#ccc')};
  border-radius: 5px;

  &:first-child {
    margin-top: 20px;
    margin-bottom: 5px;
  }
`;

interface InputComponentProps {
  otherProps: any;
  error: boolean;
}

export default function RegisterInput({
  error,
  ...otherPros
}: InputComponentProps) {
  return <Input color={error ? 'red' : '#ccc'} {...otherPros} />;
}
