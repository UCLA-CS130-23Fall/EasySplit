import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from './index'

describe('Login Component', () => {
  it('renders without crashing', () => {
    render(<Login />)

    // Check if the component renders the title 'User Login'
    expect(screen.getByText('User Login')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
  })
})
