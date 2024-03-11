import { configureStore } from "@reduxjs/toolkit";
import surveySlice from "./suvrey-slice";
import authReducers from "./auth-slice";
import departmentSlice from "./department-slice";
const store = configureStore({
  reducer: {
    auth: authReducers,
    survey: surveySlice.reducer,
    department: departmentSlice.reducer,
  },
});
export default store;
