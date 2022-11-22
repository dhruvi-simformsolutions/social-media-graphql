import React, { useState,useContext, useEffect } from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { regEx } from "../constants/appConstant";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/auth";
function Register() {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const history = useNavigate();
  useEffect(()=>{
    if(context.user){
      history("/")
    }
  },[context])
  const [validateEmail, setValidateEmail] = useState(true);
  const [validateCPassword, setValidateCPassword] = useState(true);
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      context.login(result?.data?.register)
      history("/")
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await addUser();
    await setValues({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    });
  };
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
          required
          type="text"
        />

        <Form.Input
          error={!validateEmail ? "Please Enter Valid Email" : null}
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          onChange={onChange}
          required
          type="email"
          onBlur={(e) => setValidateEmail(e.target.value.match(regEx))}
        />

        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          onChange={onChange}
          required
          type="password"
        />

        <Form.Input
          error={!validateCPassword ? "Password Doesn't Match" : null}
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(e) => {
            onChange(e);
            setValidateCPassword(e.target.value === values.password);
          }}
          required
          type="password"
        />
        <Button
          type="submit"
          color="teal"
          disabled={
            Object.values(values).some((element) => element === "") ||
            !validateCPassword
          }
        >
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
