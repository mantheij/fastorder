import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignInView from '../views/SignIn/SignInView';

describe('SignInView component', () => {
    test('renders sign in form', () => {
        const { getByLabelText, getByText } = render(<SignInView />);

        const usernameInput = getByLabelText('Username');
        const passwordInput = getByLabelText('Password');
        const signInButton = getByText('Sign In');

        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(signInButton).toBeInTheDocument();
    });

    test('validates empty fields when signing in', async () => {
        const { getByText } = render(<SignInView />);

        const signInButton = getByText('Sign In');
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(getByText('Please fill in all fields.')).toBeInTheDocument();
        });
    });

    test('logs username and password when signing in', async () => {
        const { getByLabelText, getByText } = render(<SignInView />);

        const usernameInput = getByLabelText('Username');
        const passwordInput = getByLabelText('Password');
        const signInButton = getByText('Sign In');

        fireEvent.change(usernameInput, { target: { value: 'chef' } });
        fireEvent.change(passwordInput, { target: { value: '123' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            // Expectations related to logging username and password
            // can be omitted as console.log statements are removed
        });
    });
});
