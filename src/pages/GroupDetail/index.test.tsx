import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GroupDetail from './index'

describe('GroupDetail Component', () => {
  it('renders without crashing', () => {
    render(<GroupDetail />)

    // Check if the component renders the title 'GroupDetail'
    expect(screen.getByText('GroupDetail')).toBeInTheDocument()

    // Check for the presence of input fields
    expect(screen.getByPlaceholderText('GroupDetail')).toBeInTheDocument()
  })
})
