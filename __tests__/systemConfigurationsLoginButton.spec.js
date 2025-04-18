import { render, screen } from '@testing-library/react';
import AuthButton from '../src/routes/systemConfigurations';
import userEvent from '@testing-library/user-event';

// Helper to clear session storage before each test
// Mock sessionStorage if running outside the browser
beforeAll(() => {
  const storageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => (store[key] = value.toString()),
      removeItem: (key) => delete store[key],
      clear: () => (store = {}),
    };
  })();
  Object.defineProperty(window, 'sessionStorage', {
    value: storageMock,
  });
});

beforeEach(() => {
  sessionStorage.clear();
});

describe('AuthButton component', () => {
  test('Login button is disabled if docId and/or apiKey is empty', () => {
    render(<AuthButton />);

    // Get the login button by its text
    const loginButton = screen.getByRole('button', { name: /test connection \(login\)/i });

    // Should be disabled initially if sessionStorage has no values
    expect(loginButton).toHaveProperty('disabled', true);
  });

  test('Login button is enabled when both docId and apiKey are provided', async () => {
    render(<AuthButton />);
    const user = userEvent.setup();

    // Find the inputs by placeholder and label text
    const apiKeyInput = screen.getByPlaceholderText(/the api key is roughly 64 characters/i);
    const docIdInput = screen.getByLabelText(/execute document id/i);
    const loginButton = screen.getByRole('button', { name: /test connection \(login\)/i });

    // Fill in both inputs
    await user.type(apiKeyInput, 'some-api-key-1234567890');
    await user.type(docIdInput, 'some-doc-id-987654321');

    // Button should now be enabled
    expect(loginButton).not.toHaveProperty('disabled', true);
  });

  test('Login button is disabled if only one field is filled', async () => {
    render(<AuthButton />);
    const user = userEvent.setup();

    const apiKeyInput = screen.getByPlaceholderText(/the api key is roughly 64 characters/i);
    const docIdInput = screen.getByLabelText(/execute document id/i);
    const loginButton = screen.getByRole('button', { name: /test connection \(login\)/i });

    // Fill only API key
    await user.type(apiKeyInput, 'only-key');
    expect(loginButton).toHaveProperty('disabled', true);

    // Clear and fill only Doc ID
    await user.clear(apiKeyInput);
    await user.type(docIdInput, 'only-doc-id');
    expect(loginButton).toHaveProperty('disabled', true);
  });

  
});
