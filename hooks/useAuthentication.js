import { useState, useEffect } from 'react';
import firebase from '../firebase';

const useAuthentication = () => {
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            user ? setAuthenticatedUser(user) : setAuthenticatedUser(null);
        });
        return () => unsubscribe();
    }, [])

    return authenticatedUser;
}

export default useAuthentication;