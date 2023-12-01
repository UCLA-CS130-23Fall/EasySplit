import Bmob from 'hydrogen-js-sdk'

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
