import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface AdminState {
  totalSubmissions: number;
  mostSelectedFrontend: string;
  mostSelectedBackend: string;
  mostSelectedDatabase: string;
}

const initialState: AdminState = {
  totalSubmissions: 0,
  mostSelectedFrontend: "",
  mostSelectedBackend: "",
  mostSelectedDatabase: "",
};

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
      state.totalSubmissions = action.payload.totalSubmissions;
      state.mostSelectedFrontend = action.payload.mostSelectedFrontend;
      state.mostSelectedBackend = action.payload.mostSelectedBackend;
      state.mostSelectedDatabase = action.payload.mostSelectedDatabase;
    },
  },
});

export const { setDashboardStats } = adminSlice.actions;
export default adminSlice.reducer;
