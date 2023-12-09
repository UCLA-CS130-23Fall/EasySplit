import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Settings from './index'

describe('Settings Component', () => {
  it('renders without crashing', () => {
    render(<Settings />)

    // Check if the component renders the title 'User Settings'
    expect(screen.getByText('User Settings')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()

    // Check for the presence of the 'Save Changes' button
    expect(
      screen.getByRole('button', { name: 'Save Changes' }),
    ).toBeInTheDocument()
  })
})
