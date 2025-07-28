import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../assets/lib/authSlice';
import surveyReducer from '../assets/lib/surveySlice';


export const store = configureStore({ 
  reducer: {
    auth: authReducer, // Authentication state management
    survey: surveyReducer, // Survey state management
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;