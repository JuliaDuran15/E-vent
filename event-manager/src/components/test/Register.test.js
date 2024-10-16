import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Register from '../Register';

const mock = new MockAdapter(axios);

describe('Register Component', () => {
  it('registers a new user successfully', async () => {
    mock.onPost('http://localhost:5000/register').reply(200, {
      message: 'Usuário registrado com sucesso!',
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'johndoe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Registrar'));

    expect(await screen.findByText('Usuário registrado com sucesso!')).toBeInTheDocument();
  });

  it('shows error message on registration failure', async () => {
    mock.onPost('http://localhost:5000/register').reply(500);

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'johndoe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Registrar'));

    expect(await screen.findByText('Erro ao registrar o usuário.')).toBeInTheDocument();
  });
});
