import { formatPrice } from './utils'
import { render } from '@testing-library/react'
import React from 'react'

describe('formatPrice', () => {
  it('formats RUB without pennies', () => {
    expect(formatPrice(1590)).toMatch(/1\s?590\s?€/)
  })
})

function Dummy() { return <div>Hello</div> }
test('react works', () => {
  const { getByText } = render(<Dummy />)
  expect(getByText('Hello')).toBeInTheDocument()
})
