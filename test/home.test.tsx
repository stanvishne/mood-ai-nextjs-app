import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import HomePage from '../app/page'
import { ClerkProvider } from '@clerk/nextjs'

vi.mock('@clerk/nextjs', () => {
  const mockedFunctions = {
    auth: () =>
      new Promise((resolve) => resolve({ userId: 'user+2387463874' })),
    ClerkProvider: ({ children }: any) => <div>{children}</div>,
    useUser: () => ({
      isSignedIn: true,
      user: {
        id: 'user+2387463874',
        fullName: 'Bla Bla',
      },
    }),
  }
  return mockedFunctions
})

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}))

test('Home', async () => {
  render(await HomePage())
  expect(screen.getByText('tracking your mood')).toBeTruthy()
})
