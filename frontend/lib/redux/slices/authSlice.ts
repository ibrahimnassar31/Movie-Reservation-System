'use client';

     import { createSlice, PayloadAction } from '@reduxjs/toolkit';
     import { User } from '@/types/user';

     interface AuthState {
       user: User | null;
       token: string | null;
     }

     const initialState: AuthState = {
       user: null,
       token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
     };

     const authSlice = createSlice({
       name: 'auth',
       initialState,
       reducers: {
         setCredentials: (
           state,
           action: PayloadAction<{ user: User; token: string }>,
         ) => {
           state.user = action.payload.user;
           state.token = action.payload.token;
           if (typeof window !== 'undefined') {
             localStorage.setItem('token', action.payload.token);
           }
         },
         logout: (state) => {
           state.user = null;
           state.token = null;
           if (typeof window !== 'undefined') {
             localStorage.removeItem('token');
           }
         },
       },
     });

     export const { setCredentials, logout } = authSlice.actions;
     export default authSlice.reducer;