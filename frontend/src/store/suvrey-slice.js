import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../consts";

export const getSurvey = createAsyncThunk("fetchSurveys", async (orgId,authToken) => {
    const response = await fetch(`${BASE_URL}/survey/get/${orgId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.surveys;
});

const calculateAverageInclusionScore = (survey) => {
  const inclusionScores = survey.map((item) => item.inclusionScore);
  const averageInclusionScore =
    inclusionScores.reduce((sum, score) => sum + score, 0) /
    inclusionScores.length;
  return averageInclusionScore;
};

const surveySlice = createSlice({
  name: "survey",
  initialState: {
    survey: [],
    status: "idle",
    error: null,
    averageInclusionScore: 0,
  },
  reducers: {
    calculateAverageInclusionScoreAction: (state) => {
      state.averageInclusionScore = calculateAverageInclusionScore(
        state.survey
      );
    },
    getLast5Surveys: (state) => {
      state.survey = state.survey.slice(-5);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSurvey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSurvey.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.survey = action.payload;
        state.averageInclusionScore = calculateAverageInclusionScore(
          action.payload
        );
      })
      .addCase(getSurvey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const surveyActions =
  surveySlice.actions;

export default surveySlice;
