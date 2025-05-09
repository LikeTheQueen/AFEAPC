import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from 'src/routes/landing';
import { createMemoryRouter, RouterProvider } from 'react-router';

const routes = [
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <div>Login Page</div> }, 
  ];


describe('Users should be able to navigate to the login button from the landing page',() => {

    test('Should naviagte to login page on NavLink click', async () => {
        const user = userEvent.setup();
        const router = createMemoryRouter(routes, { initialEntries: ['/'] });

    render(<RouterProvider router={router} />);
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.click(loginButton);
        expect(await screen.findByText('Login Page')).toBeInTheDocument();
    })
})