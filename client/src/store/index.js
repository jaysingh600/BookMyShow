import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cityReducer from './citySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    city: cityReducer,
  },
});
