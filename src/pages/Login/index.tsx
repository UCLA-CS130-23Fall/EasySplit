import Bmob from 'hydrogen-js-sdk'
let secretKey, apiKey
if (process.env.NODE_ENV === 'test') {
  secretKey = 'mock_secret_key'
  apiKey = 'mock_api_key'
} else {
  secretKey = import.meta.env.VITE_BMOB_SECRET_KEY
  apiKey = import.meta.env.VITE_BMOB_API_KEY
}

Bmob.initialize(secretKey, apiKey)

import React, { useEffect } from 'react'
import LoginForm from './form'
import { history } from '@vitjs/runtime'
import './index.less'

const Login: React.FC = () => {
  const current = Bmob.User.current()

  useEffect(() => {
    if (current) {
      history.push('/app')
    }
  }, [current, history])

  return (
    <div className='login-container'>
      <LoginForm />
    </div>
  )
}

export default Login
