import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for the admin slice
interface AdminState {
  totalSubmissions: number;
  mostSelectedFrontend: string;
  mostSelectedBackend: string;
  mostSelectedDatabase: string;
}

// Initial state for the admin slice
const initialState: AdminState = {
  totalSubmissions: 0,
  mostSelectedFrontend: "",
  mostSelectedBackend: "",
  mostSelectedDatabase: "",
};

// Create the admin slice with actions and reducers
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setDashboardStats(
      state,
      action: PayloadAction<{
        totalSubmissions: number;
        mostSelectedFrontend: string;
        mostSelectedBackend: string;
        mostSelectedDatabase: string;
      }>
    ) {
      state.totalSubmissions = action.payload.totalSubmissions; // Update the total submissions count
      state.mostSelectedFrontend = action.payload.mostSelectedFrontend; // Update the most selected frontend technology
      state.mostSelectedBackend = action.payload.mostSelectedBackend; // Update the most selected backend technology
      state.mostSelectedDatabase = action.payload.mostSelectedDatabase; // Update the most selected database technology
    },
  },
});

export const { setDashboardStats } = adminSlice.actions;
export default adminSlice.reducer;
