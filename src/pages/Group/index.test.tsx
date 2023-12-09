import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Group from './index'

describe('Group Component', () => {
  it('renders without crashing', () => {
    render(<Group />)

    // Check if the component renders the title 'Group'
    expect(screen.getByText('Group')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('Group')).toBeInTheDocument()
  })
})
