import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignInView from './SignInView';

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

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith('Username:', 'testuser');
            expect(console.log).toHaveBeenCalledWith('Password:', 'testpassword');
        });
    });
});
