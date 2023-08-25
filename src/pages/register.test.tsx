import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'
import Register from './register'
import App from '../app'
import { rest, server } from '../test-server'

test('register: when rendering the page the button should be disabled', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', {name: /sign up/i})).toBeDisabled()
});

test('register: after entering a value in name, email & password the button should be enabled', () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  const name = screen.getByLabelText('name').querySelector('input')!
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  userEvent.type(name, 'ayman')
  userEvent.type(email, 'aw@tt.com')
  userEvent.type(password, '12345')
  expect(screen.getByRole('button', {name: /sign up/i})).toBeEnabled()
});

test('register: after entering a short name then the button should be disabled', async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  const name = screen.getByLabelText('name').querySelector('input')!
  userEvent.type(name, 'test')
  expect(screen.getByRole('button', {name: /sign up/i})).toBeDisabled()
  expect(await screen.findByText(/name must be more than 4/i)).toBeInTheDocument()
});

test('register: after entering a value with numbers in the name field then the button should be disabled', async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  const name = screen.getByLabelText('name').querySelector('input')!
  userEvent.type(name, 'test1')
  expect(screen.getByRole('button', {name: /sign up/i})).toBeDisabled()
  expect(await screen.findByText(/name must not contain numbers/i)).toBeInTheDocument()
});

test('register: after entering a short password then the button should be disabled', async () => {
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  const password = screen.getByLabelText('password').querySelector('input')!
  userEvent.type(password, '123')
  expect(screen.getByRole('button', {name: /sign up/i})).toBeDisabled()
  expect(await screen.findByText(/password must be more than 4/i)).toBeInTheDocument()
});

test('register: failing the register process', async () => {
  server.use(
    rest.post('http://localhost:5000/api/auth/register', (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({errors: {email: 'email already exists'}})
      )
    })
  )
  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
  const name = screen.getByLabelText('name').querySelector('input')!
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  const button = screen.getByRole('button', {name: /sign up/i})
  userEvent.type(name, 'testt')
  userEvent.type(email, 'test@tt.com')
  userEvent.type(password, '12345')
  expect(button).toBeEnabled()
  userEvent.click(button)
  expect(await screen.findByText('email already exists')).toBeInTheDocument();
});

test('register: succeeding the register process', async () => {
  server.use(
    rest.post('http://localhost:5000/api/auth/register', (req, res, ctx) => {
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
  const link = screen.getByLabelText('signup')
  userEvent.click(link)
  expect(await screen.findAllByText(/sign up/i)).toHaveLength(2)
  const name = screen.getByLabelText('name').querySelector('input')!
  const email = screen.getByLabelText('email').querySelector('input')!
  const password = screen.getByLabelText('password').querySelector('input')!
  const button = screen.getByRole('button', {name: /sign up/i})
  userEvent.type(name, 'testt')
  userEvent.type(email, 'test@tt.com')
  userEvent.type(password, '12345')
  expect(button).toBeEnabled()
  userEvent.click(button)
  expect(await screen.findByText(/home page/i)).toBeInTheDocument();
});


