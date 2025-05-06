import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from 'src/routes/landing';
import LoginForm from 'src/routes/login';
import { MemoryRouter, useNavigate } from 'react-router';

test( 'renders the landing page by default', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <LandingPage />
        </MemoryRouter>
    );
    const mainSection = screen.getByRole("region")
    expect(mainSection).toBeInTheDocument()
});

test( 'Navigates to the login page', () => {
    render(
        <MemoryRouter initialEntries={['/login']}>
            <LoginForm />
        </MemoryRouter>
    );
    const mainSection = screen.getByText("Login")
    expect(mainSection).toBeInTheDocument()
});

