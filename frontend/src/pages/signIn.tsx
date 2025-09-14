'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router';
import { useSession } from '../SessionContext';
import API from '../components/api/axios'

const GetSession = async (formData: any): Promise<Session> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      API.post('/api/token/',{
        username: formData.get('email').split('@')[0],
        password: formData.get('password')
      }).then((response) => {
        if(response.status === 200){
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('referech_token', response.data.refresh);
          resolve({
            user: {
              name: formData.get('email').split('@')[0],
              email: formData.get('email') || '',
              
            },
          });
        }else{
          reject(new Error('Incorrect credentials.'));
        }
        
      })
  },1000);
  })
}

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <SignInPage 
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {

        try {
          const session = await GetSession(formData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' };
        }
        return {};
      }}
    />
  );
}
