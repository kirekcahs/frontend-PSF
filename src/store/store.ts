import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../assets/lib/authSlice';
import adminReducer from '../assets/lib/adminSlice';
import surveyReducer from '../assets/lib/surveySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    survey: surveyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;