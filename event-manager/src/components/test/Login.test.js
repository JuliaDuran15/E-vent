import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from '../Login';

const mock = new MockAdapter(axios);

describe('Login Component', () => {
  it('logs in successfully', async () => {
    mock.onPost('http://localhost:5000/login').reply(200, {
      message: 'Login bem-sucedido!',
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'johndoe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Login bem-sucedido')).toBeInTheDocument();
  });

  it('shows error message on login failure', async () => {
    mock.onPost('http://localhost:5000/login').reply(500);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'johndoe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Login'));

    expect(await screen.findByText('Erro ao fazer login.')).toBeInTheDocument();
  });
});
