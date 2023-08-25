import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import Login from './login'
import App from '../app'
import userEvent from '@testing-library/user-event';
import { rest, server } from '../test-server'

test('login: when rendering the page the button should be disabled', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', {name: /sign in/i})).toBeDisabled()
});

test('login: after entering a value in email & password the button should be enabled', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  userEvent.type(email, 'aw@tt.com')
  userEvent.type(password, '123')
  expect(screen.getByRole('button', {name: /sign in/i})).toBeEnabled()
});

test('login: failing the login process', async () => {
  server.use(
    rest.post('http://localhost:5000/api/auth/login', (req, res, ctx) => {
      return res(
        ctx.status(401)
      )
    })
  )
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  const button = screen.getByRole('button', {name: /sign in/i})
  userEvent.type(email, 'aw@tt.com')
  userEvent.type(password, '123')
  userEvent.click(button)
  expect(await screen.findByText('Login Failed')).toBeInTheDocument();
});

test('login: succeeding the login process', async () => {
  server.use(
    rest.post('http://localhost:5000/api/auth/login', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({user: '', token: ''})
      )
    })
  )
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  )
  userEvent.click(screen.getByLabelText('login'))
  expect(await screen.findAllByText(/sign in/i)).toHaveLength(2)
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  const button = screen.getByRole('button', {name: /sign in/i})
  userEvent.type(email, 'test@gmail.com')
  userEvent.type(password, '123')
  expect(button).toBeEnabled()
  userEvent.click(button)
  expect(await screen.findByText(/home page/i)).toBeInTheDocument();
});


