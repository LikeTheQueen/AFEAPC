vi.mock('src/blocks/LiquidEther', () => ({
  default: () => null
}));

import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PublicLayout from 'src/routes/webpage/publicLayout';
import Homepage from 'src/routes/webpage/homepage';
import NavHeader from 'src/routes/webpage/navHeader';
import LoginForm from 'src/routes/userLogin/routes/login';
import { APP_LOGO } from 'src/constants/variables';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router';
import supabase from 'provider/supabase';
import * as writeProvider from 'provider/write';
import { vi, type Mock } from 'vitest';

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

vi.mock('provider/write', () => ({
  writeToFunctionLogs: vi.fn(),
}))

const routes = [
    { 
        path: '/', 
        element: <PublicLayout />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'login', element: <LoginForm /> },
        ]
    },
    { path: '/mainscreen/afe', element: <div>Main Screen</div> },
];

const renderRouter = (initialEntry = '/') => {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  render(<RouterProvider router={router} />);
};

describe('Users should be able to navigate to the login button from the landing page',() => {

  beforeEach(() => {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
    data: { session: null }, 
    error: null 
  });
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } }
  } as any);
  vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({ 
  data: { user: null, session: null, messageId: null },
  error: null 
});
  vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
    data: { session: { user: { id: '123' } } },
    error: null
  } as any);
});

  afterEach(() => {
    cleanup();
        vi.resetAllMocks();
        vi.clearAllMocks();
    });

  test('Should naviagte to login page on login button click and allow user to input email address', async () => {
    const user = userEvent.setup();
    renderRouter('/');

    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    expect(await screen.findByText('Email')).toBeInTheDocument();

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    expect(emailInput).toBeInTheDocument();

    const loginButtonSubmit = screen.getByRole('button', { name: /get verification code/i, hidden: true })

    expect(loginButtonSubmit).toBeDisabled();

    await user.type(emailInput, 'eandv');

    expect(loginButtonSubmit).toBeDisabled();

    await user.clear(emailInput)
    await user.type(emailInput, 'eandv3851@gmail.com');

    expect(loginButtonSubmit).not.toBeDisabled();

  });

  test('Should call signInWithOtp with correct email', async () => {
    const user = userEvent.setup();
    renderRouter('/login');

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = await screen.findByRole('button', { name: /get verification code/i });
    

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'eandv3851@gmail.com',
      options: { shouldCreateUser: false }
    });

    await waitFor(() => {
    expect(screen.getByText('Verification Code')).toBeVisible();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    });

    await user.click(screen.getByRole('button', { name: /back/i }));

    await waitFor(() => {
    expect(screen.getByText('Verification Code')).not.toBeVisible();
    expect(emailInput).toHaveValue("eandv3851@gmail.com");
    });

    const enterOTP = screen.getByRole('button', { name: /I Have the Verification Code/i });

    expect(enterOTP).toBeVisible();
    expect(submitButton).toBeDisabled();

    await user.click(enterOTP);

    await waitFor(() => {
    expect(screen.getByText('Verification Code')).toBeVisible();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    });

  });

  test('Should call signInWithOtp with incorrect email', async () => {
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({ 
  data: { user: null, session: null, messageId: null },
  error: { name: 'AuthApiError', message: 'Invalid OTP' } as any 
});
    const user = userEvent.setup();
    renderRouter('/login');

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = await screen.findByRole('button', { name: /get verification code/i });
    

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'eandv3851@gmail.com',
      options: { shouldCreateUser: false }
    });

    await waitFor(() => {
    expect(screen.getByText('Verification Code')).not.toBeVisible();
    expect(emailInput).toHaveValue("eandv3851@gmail.com");
    });

    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalledOnce();

  });

  test('Should show screen for user to input verification code error response', async () => {
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { user: null, session: null },
      error: { name: 'AuthApiError', message: 'Invalid OTP' } as any
    });

    //(writeProvider.writeToFunctionLogs as Mock).mockResolved

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    // OTP section appears
    expect(await screen.findByText('Verification Code')).toBeInTheDocument();

    const OTPinput = screen.getAllByRole('textbox',{ name: 'OTP' })
    expect(OTPinput).toHaveLength(6);

    await user.type(OTPinput[0], '1');
    expect(OTPinput[0]).toHaveValue('1');
    await user.type(OTPinput[1], '1');
    await user.type(OTPinput[2], '1');
    await user.type(OTPinput[3], '1');
    await user.type(OTPinput[4], '1');
    await user.type(OTPinput[5], '1');

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({"email" :"eandv3851@gmail.com","token" : "111111", "type" : "email"});

    expect(OTPinput[0]).toHaveValue('');

    expect(writeProvider.writeToFunctionLogs).toHaveBeenCalledOnce();


  });

  test('Should show screen for user to input verification code no response', async () => {
    
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    await user.click(submitButton);

    // OTP section appears
    expect(await screen.findByText('Verification Code')).toBeInTheDocument();

    const OTPinput = screen.getAllByRole('textbox',{ name: 'OTP' })
    expect(OTPinput).toHaveLength(6);

    await user.type(OTPinput[0], '1');
    expect(OTPinput[0]).toHaveValue('1');
    await user.type(OTPinput[1], '1');
    await user.type(OTPinput[2], '1');
    await user.type(OTPinput[3], '1');
    await user.type(OTPinput[4], '1');
    await user.type(OTPinput[5], '1');

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({"email" :"eandv3851@gmail.com","token" : "111111", "type" : "email"});

    expect(OTPinput[0]).toHaveValue("1");

    expect(writeProvider.writeToFunctionLogs).not.toHaveBeenCalled();

  });

  test('Should show screen for user to input verification code no response pastes code in', async () => {
    
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    )

    const emailInput = await screen.findByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', { name: /get verification code/i });

    await user.type(emailInput, 'eandv3851@gmail.com');
    
    await act(async () => {
    await user.click(submitButton);
    });

    // OTP section appears
    expect(await screen.findByText('Verification Code')).toBeInTheDocument();

    const OTPinput = screen.getAllByRole('textbox',{ name: 'OTP' })
    expect(OTPinput).toHaveLength(6);

    const pasteEvent = new ClipboardEvent('paste', {
    clipboardData: new DataTransfer(),
    bubbles: true,
  });
  pasteEvent.clipboardData!.setData('text', '111111');

  fireEvent(OTPinput[0], pasteEvent);

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({"email" :"eandv3851@gmail.com","token" : "111111", "type" : "email"});

    expect(OTPinput[0]).toHaveValue("1");

    expect(writeProvider.writeToFunctionLogs).not.toHaveBeenCalled();

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

    const router = createMemoryRouter(routes, { initialEntries: ['/login'] });
  render(<RouterProvider router={router} />);

  expect(await screen.findByText('Main Screen')).toBeInTheDocument();

    
  });

});

describe('LoginForm — resend cooldown timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Re-establish mocks since resetAllMocks in the outer afterEach wipes them
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as any);
    vi.mocked(supabase.auth.signInWithOtp).mockResolvedValue({
      data: { user: null, session: null, messageId: null },
      error: null,
    });
    vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    } as any);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers()
  })

  const renderForm = () =>
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

  const advanceToOTPScreen = async () => {
    renderForm();

    // Resolve the signInWithOtp promise
    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    });

    await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /get verification code/i }));
    await Promise.resolve();
  });

  };

  const getCountdown = () => {
  const button = screen.getByRole('button', { 
    name: /Request Verification Code Again in \d+s/i 
  });
  return parseInt(button.textContent!.match(/(\d+)s/)![1]);
};

  test('shows resend button with countdown immediately after sending code', async () => {
    
    await advanceToOTPScreen();

    expect(screen.getByText('Verification Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    
    await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
  });

  expect(screen.getByRole('button', { name: /Request Verification Code Again in 30s/i })).toBeInTheDocument();

  })

  test('counts down each second', async () => {
    await advanceToOTPScreen();

    expect(screen.getByText('Verification Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    
    await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
  });

   const startSeconds = getCountdown();

  await act(async () => { vi.advanceTimersByTime(1000); });
  expect(getCountdown()).toBe(startSeconds - 1);

  for (let i = 0; i < 10; i++) {
    await act(async () => { vi.advanceTimersByTime(1000); });
  }
  expect(getCountdown()).toBe(startSeconds - 11);

  });

  test('enables resend button after 30 seconds', async () => {
    await advanceToOTPScreen();

    expect(screen.getByText('Verification Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    
    await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
  });

    const startSeconds = getCountdown();
  expect(screen.getByRole('button', { name: /Request Verification Code Again in \d+s/i })).toBeDisabled();

  for (let i = 0; i < startSeconds; i++) {
    await act(async () => { vi.advanceTimersByTime(1000); });
  }

  expect(screen.getByRole('button', { name: /get verification code/i })).toBeEnabled();
  });

  test('resets cooldown when resend is clicked', async () => {
    await advanceToOTPScreen();

    expect(screen.getByText('Verification Code')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeVisible();
    
    await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
  });

   const startSeconds = getCountdown();

  for (let i = 0; i < startSeconds; i++) {
    await act(async () => { vi.advanceTimersByTime(1000); });
  }

  expect(screen.getByRole('button', { name: /get verification code/i })).toBeEnabled();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Get Verification Code/i }));
  });

  // Should have gone back to OTP screen after resend
  expect(screen.getByText('Verification Code')).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
  });

  // Cooldown should have reset to ~30s
  expect(screen.getByRole('button', { 
    name: /Request Verification Code Again in \d+s/i 
  })).toBeDisabled();
  })
});