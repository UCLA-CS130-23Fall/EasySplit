import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Finance from './index'

describe('Finance Component', () => {
  it('renders without crashing', () => {
    render(<Finance />)

    // Check if the component renders the title 'Finance'
    expect(screen.getByText('Finance')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('Finance')).toBeInTheDocument()
  })
})
