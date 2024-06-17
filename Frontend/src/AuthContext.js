import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);

    const saveToken = (token) => {
        setAuthToken(token);
        console.log(token)
        localStorage.setItem('authToken', token);
    };

    const removeToken = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ authToken, saveToken, removeToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
