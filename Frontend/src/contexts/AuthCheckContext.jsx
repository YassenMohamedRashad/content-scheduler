import { createContext, useContext, useState } from 'react';

const AuthCheckContext = createContext();

export const AuthProvider = ( { children } ) =>
{
    const [ user, setUser ] = useState( null ); // or token

    return (
        <AuthCheckContext.Provider value={ { user, setUser } }>
            { children }
        </AuthCheckContext.Provider>
    );
};

export const useAuth = () => useContext( AuthCheckContext );
