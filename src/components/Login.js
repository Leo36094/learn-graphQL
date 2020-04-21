import React, { useReducer } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

// constants
import { AUTH_TOKEN } from '../constants'

const reducer = (state, action) => {
  const { userInfo } = action
  const { name, email, password } = userInfo

  switch (action.type) {
    case 'login':
      return {
        ...state,
        login: !state.login,
      }

    case 'edit':
      return {
        ...state,
        password,
        name,
        email,
      }

    default:
      return state
  }
}

const initialState = {
  login: false,
  email: '',
  password: '',
  name: '',
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

const _saveUserData = (token) => {
  localStorage.setItem(AUTH_TOKEN, token)
}

const Login = (props) => {
  const { history } = props

  const [state, dispatch] = useReducer(reducer, initialState)
  const { login, name, email, password } = state
  const _confirm = async (data) => {
    // ... you'll implement this 🔜
    const { token } = login ? data.login : data.signup
    _saveUserData(token)
    history.push('/')
  }

  return (
    <div>
      <h4 className='mv3'>{login ? 'Login' : 'Sign Up'}</h4>
      <div className='flex flex-column'>
        {!login && (
          <input
            value={name}
            onChange={(e) =>
              dispatch({
                type: 'edit',
                userInfo: { name: e.target.value, email, password },
              })
            }
            type='text'
            placeholder='Your name'
          />
        )}
        <input
          value={email}
          onChange={(e) =>
            dispatch({
              type: 'edit',
              userInfo: { name, email: e.target.value, password },
            })
          }
          type='text'
          placeholder='Your email address'
        />
        <input
          value={password}
          onChange={(e) =>
            dispatch({
              type: 'edit',
              userInfo: { name, email, password: e.target.value },
            })
          }
          type='password'
          placeholder='Choose a safe password'
        />
      </div>
      <div className='flex mt3'>
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ email, password, name }}
          onCompleted={(data) => _confirm(data)}>
          {(mutation) => (
            <div className='pointer mr2 button' onClick={mutation}>
              {login ? 'login' : 'create account'}
            </div>
          )}
        </Mutation>
        <div
          className='pointer button'
          onClick={() =>
            dispatch({ type: 'login', userInfo: { name, email, password } })
          }>
          {login ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    </div>
  )
}

export default Login
