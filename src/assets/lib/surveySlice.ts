import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface SurveySubmission {
  name: string;
  email: string;
  role: string;
  preferredFrontend: string;
  preferredBackend: string;
  preferredDatabase: string;
  preferredHosting: string;
  fileUrl?: string; 
}

interface SurveyState {
  submissions: SurveySubmission[];
}

const initialState: SurveyState = {
  submissions: [],
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<SurveySubmission>) {
      state.submissions.push(action.payload);
    },
    setSubmissions(state, action: PayloadAction<SurveySubmission[]>) {
      state.submissions = action.payload;
    }
  },
});

export const { addSubmission, setSubmissions } = surveySlice.actions;
export default surveySlice.reducer;
