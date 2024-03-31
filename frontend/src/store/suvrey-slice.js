import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../consts";

export const getSurvey = createAsyncThunk("fetchSurveys", async (obj) => {
    const response = await fetch(`${BASE_URL}/survey/get/${obj.orgId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + obj.token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.surveys;
});
export const getUserSurvey = createAsyncThunk("fetchUserSurveys", async (obj) => { 
  const[surveyResponse, userSurveyResponse] = await Promise.all([
    fetch(`${BASE_URL}/survey/get/${obj.orgId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + obj.token,
        "Content-Type": "application/json",
      },
    }),
    fetch(`${BASE_URL}/survey/getSurveys/${obj.userId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + obj.token,
        "Content-Type": "application/json",
      },
    }),
  ]);

  const [surveyData, userData] = await Promise.all([
    surveyResponse.json(),
    userSurveyResponse.json(),
  ]);

  const surveys = surveyData.surveys;
  const userSurveys = userData.surveys;
 


  const updatedSurveys = surveys.map((survey) => {
    const userSurvey = userSurveys.find(
      (userSurvey) => userSurvey.surveyId === survey._id
    );
    return userSurvey
      ? {
          ...survey,
          score: userSurvey.score,
        }
      : survey;
  });

  console.log(surveys);
  console.log(userSurveys);
  console.log("u",updatedSurveys);


  return updatedSurveys;
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
        // state.averageInclusionScore = calculateAverageInclusionScore(
        //   action.payload
        // );
      })
      .addCase(getSurvey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getUserSurvey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserSurvey.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.survey = action.payload;
      })
      .addCase(getUserSurvey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const surveyActions =
  surveySlice.actions;

export default surveySlice;
