// frontend/src/components/api/useIsAdmin.ts
'use client'
import * as React from 'react';
import API from '../api/axios';

/**
 * Returns [isAdmin, isLoading] for the authenticated user.
 * Reads the role from /users/me/ (Profile model, sprint 3).
 */
export default function useIsAdmin(): [boolean, boolean] {
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        let active = true;
        (async () => {
            try {
                const res = await API.get('/users/me/');
                if (active) setIsAdmin(res.data.role === 'ADMIN');
            } catch {
                if (active) setIsAdmin(false);
            } finally {
                if (active) setIsLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    return [isAdmin, isLoading];
}
