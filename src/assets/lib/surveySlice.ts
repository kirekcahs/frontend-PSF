import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type{ RootState } from '../../store/store';



export interface Submission {  
  name: string;
  email: string;
  role: string;
  preferredFrontend: string;
  preferredBackend: string;
  preferredDatabase: string;
  preferredHosting: string;
  fileUrl?: string;
  fileName?: string;
 
  preferredFrontendOther?: string;
  preferredBackendOther?: string;
  preferredDatabaseOther?: string;
  preferredHostingOther?: string;
}


interface SurveyState {
  submissions: Submission[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SurveyState = {
  submissions: [],
  status: 'idle',
  error: null,
};

//fetches whatever data the API provides
export const fetchSubmissions = createAsyncThunk(
  'survey/fetchSubmissions',
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }
    try {
      const response = await axios.get('/api/submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data.');
    }
  }
);


const surveySlice = createSlice({ 
  name: 'survey',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubmissions.fulfilled, (state, action: PayloadAction<Submission[]>) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default surveySlice.reducer;