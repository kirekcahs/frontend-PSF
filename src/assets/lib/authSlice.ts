import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../../store/hooks';

// Define the user interface and initial state for authentication
interface User { id: string; name: string; }
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Get the token and user from localStorage to initialize the state
const token = localStorage.getItem('authToken');
const user = localStorage.getItem('authUser');

// Initial state for the auth slice
const initialState: AuthState = {
  isAuthenticated: !!token,
  user: user ? JSON.parse(user) : null,
  token: token,
  status: 'idle',
  error: null,
};

// Async thunk for user login. thunk is a function that returns a promise
// This function will handle the login process, including API calls and state updates
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login', { email: credentials.username, password: credentials.password });
      const token = response.data.token;
      const user = { id: credentials.username, name: credentials.username };
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Invalid credentials');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => { // Action to log out the user
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
  extraReducers: (builder) => { // Handle the login action's pending, fulfilled, and rejected states
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => { // If login fails, set the status to failed and store the error message
        state.status = 'failed'; 
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser } = authSlice.actions;

export const useAuth = () => {// Custom hook to access auth state and actions
  const dispatch = useAppDispatch();
  return {
    ...useAppSelector((state) => state.auth),
    login: (credentials: { username: string, password: string }) => dispatch(login(credentials)),
    logoutUser: () => dispatch(logoutUser()),
  };
};

export default authSlice.reducer;