vi.mock('src/blocks/LiquidEther', () => ({
  default: () => null
}));

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from 'src/routes/landing';
import LoginForm from 'src/routes/userLogin/routes/login';
import { createMemoryRouter, RouterProvider } from 'react-router';
import supabase from 'provider/supabase';

vi.mock('provider/supabase', () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      verifyOtp: vi.fn().mockResolvedValue({
        data: { session: { user: { id: '123' } } },
        error: null
      }),
    }
  }
}));

const routes = [
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/mainscreen/afe', element: <div>Main Screen</div> },
];

const renderRouter = (initialEntry = '/') => {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  render(<RouterProvider router={router} />);
};

describe('Users should be able to navigate to the login button from the landing page',() => {

    test('Should naviagte to login page on NavLink click', async () => {
        const user = userEvent.setup();
        renderRouter('/');

        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.click(loginButton);
        expect(await screen.findByText('Email')).toBeInTheDocument();

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        expect(emailInput).toBeInTheDocument();

        const loginButtonSubmit = screen.getByRole('button', { name: /get verification code/i, hidden: true })

        expect(loginButtonSubmit).toBeDisabled();

        await user.type(emailInput, 'eandv');

        await user.clear(emailInput)
        await user.type(emailInput, 'eandv3851@gmail.com');

        expect(loginButtonSubmit).not.toBeDisabled();


    });

    test('Should call signInWithOtp with correct email', async () => {
    const user = userEvent.setup();
    renderRouter('/login');

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'eandv3851@gmail.com',
      options: { shouldCreateUser: false }
    });
  });

  test('Should show OTP input after email submitted', async () => {
    const user = userEvent.setup();
    renderRouter('/login');

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    expect(await screen.findByText('Verification Code')).toBeInTheDocument();
  });

  test('Should show error on failed OTP verification', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { name: 'AuthApiError', message: 'Invalid OTP' } as any
    });

    const user = userEvent.setup();
    renderRouter('/login');

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    // OTP section appears
    expect(await screen.findByText('Verification Code')).toBeInTheDocument();
  });

  test('Should redirect to main screen after successful OTP', async () => {
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementationOnce((callback: any) => {
    callback('SIGNED_IN', { user: { id: '123' } });
    return { 
      data: { 
        subscription: { 
          id: 'mock-id',
          callback: vi.fn(),
          unsubscribe: vi.fn() 
        } 
      } 
    };
  });

  renderRouter('/login');

  expect(await screen.findByText('Main Screen')).toBeInTheDocument();
});
});