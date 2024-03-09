import { configureStore } from "@reduxjs/toolkit";
import surveySlice from "./suvrey-slice";
import authReducers from "./auth-slice";
const store = configureStore({
  reducer: {
    auth: authReducers,
    survey: surveySlice.reducer,
  },
});
export default store;
