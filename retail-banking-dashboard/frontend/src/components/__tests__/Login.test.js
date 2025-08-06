import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from '../../pages/Login';
import { AuthProvider } from '../../utils/auth';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders login form elements', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText('Smart Banking Dashboard')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('renders demo login buttons', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText('Customer Demo')).toBeInTheDocument();
    expect(screen.getByText('Staff Demo')).toBeInTheDocument();
  });

  test('updates input values when typing', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('fills form with customer demo credentials', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const customerDemoButton = screen.getByText('Customer Demo');
    fireEvent.click(customerDemoButton);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput.value).toBe('john.doe@email.com');
    expect(passwordInput.value).toBe('demo123');
  });

  test('fills form with staff demo credentials', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const staffDemoButton = screen.getByText('Staff Demo');
    fireEvent.click(staffDemoButton);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput.value).toBe('staff@bank.com');
    expect(passwordInput.value).toBe('staff123');
  });

  test('shows loading state during form submission', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });

  test('shows error message for invalid credentials', async () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  test('requires email and password fields', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });
});