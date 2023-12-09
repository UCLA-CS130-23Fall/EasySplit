import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from './index'

describe('Dashboard Component', () => {
  it('renders without crashing', () => {
    render(<Dashboard />)

    // Check if the component renders the title 'Dashboard'
    expect(screen.getByText('Dashboard')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('Dashboard')).toBeInTheDocument()
  })
})
