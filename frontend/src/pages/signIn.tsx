// frontend/src/pages/signIn.tsx
'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router';
import { useSession } from '../SessionContext';
import API from '../components/api/axios';
import Cookies from 'js-cookie';

const GetSession = async (formData: FormData): Promise<Session> => {
  // FIX: the tokens are now stored in cookies, read by the axios
  // interceptors in components/api/api.tsx. Was localStorage before
  // (which the interceptors never read) with a 'referech_token' typo.
  const response = await API.post('/api/token/', {
    username: String(formData.get('email')).split('@')[0],
    password: formData.get('password'),
  });

  if (response.status !== 200) {
    throw new Error('Incorrect credentials.');
  }

  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24h (REFRESH_TOKEN_LIFETIME)
  Cookies.set('access_token', response.data.access, { expires, sameSite: 'strict' });
  Cookies.set('refresh_token', response.data.refresh, { expires, sameSite: 'strict' });

  return {
    user: {
      name: String(formData.get('email')).split('@')[0],
      email: String(formData.get('email')) || '',
    },
  };
};

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();

  return (
    <SignInPage
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {
        try {
          const session = await GetSession(formData as unknown as FormData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error) {
          // FIX: Axios errors were swallowed — the promise never settled if
          // the request failed, leaving the form spinning forever.
          if (error instanceof Error && error.message) {
            return { error: error.message };
          }
          return { error: 'Incorrect credentials.' };
        }
        return {};
      }}
    />
  );
}
