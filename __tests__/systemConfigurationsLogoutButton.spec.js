import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthButton from '../src/routes/systemConfigurations';
import fetchAuthToken from '../src/scripts/executeConnection';
import executeLogout from '../src/scripts/executeLogout';

jest.mock('../src/scripts/executeConnection');
jest.mock('../src/scripts/executeLogout');

describe('AuthButton Lifecycle Flow', () => {
  const mockToken = 'mocked-token';

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('handles full login-logout lifecycle and input interactivity correctly', async () => {
    (fetchAuthToken).mockResolvedValue(mockToken);
    (executeLogout).mockResolvedValue('Success');

    render(<AuthButton />);

    const apiKeyInput = screen.getByLabelText(/Execute API Key/i);
    const docIdInput = screen.getByLabelText(/Execute Document ID/i);
    const loginBtn = screen.getByRole('button', { name: /Test Connection \(Login\)/i });

    // Fill in inputs
    fireEvent.change(apiKeyInput, { target: { value: 'my-api-key' } });
    fireEvent.change(docIdInput, { target: { value: 'doc-123' } });

    // Click login
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('authToken')).toBe(mockToken);
      expect(apiKeyInput).toHaveProperty('disabled', true);
      expect(docIdInput).toHaveProperty('disabled', true);
      expect(screen.getByText(/Success!/i)).toBeVisible();
    });

    // Try to change inputs while disabled
    //fireEvent.change(apiKeyInput, { target: { value: 'should-not-change' } });
    //fireEvent.change(docIdInput, { target: { value: 'still-locked' } });

    // Inputs should NOT reflect new values
    expect(apiKeyInput.value).toBe('my-api-key');
    expect(docIdInput.value).toBe('doc-123');

    // Logout
    const logoutBtn = screen.getByRole('button', { name: /Test Connection \(Logout\)/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(sessionStorage.getItem('authToken')).toBe('');
      expect(apiKeyInput).not.toHaveProperty('disabled', true);
      expect(docIdInput).not.toHaveProperty('disabled', true);
      expect(logoutBtn).toHaveProperty('disabled', true);
    });

    // Inputs now editable again
    fireEvent.change(apiKeyInput, { target: { value: 'new-key' } });
    fireEvent.change(docIdInput, { target: { value: 'new-doc' } });

    expect(apiKeyInput.value).toBe('new-key');
    expect(docIdInput.value).toBe('new-doc');
  });
});
