import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: null| { id: string; name: string };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ id: string; name: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Store user data in localStorage
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      // Remove user data from localStorage
      localStorage.removeItem('authUser');
    },
  },
});

export const { login, logout } = authSlice.actions;

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: { auth: AuthState }) => state.auth);

  const loginUser = (user: { id: string; name: string }) => {
    // Save user data to localStorage before dispatching
    localStorage.setItem('authUser', JSON.stringify(user));
    dispatch(login(user));
  };

  const logoutUser = () => {
    // Remove user data from localStorage before dispatching
    localStorage.removeItem('authUser');
    dispatch(logout());
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loginUser,
    logoutUser,
  };
};

export default authSlice.reducer;