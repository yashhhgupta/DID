import { configureStore } from "@reduxjs/toolkit";
import surveySlice from "./suvrey-slice";
import authReducers from "./auth-slice";
import loaderReducers from "./loader-slice";
import departmentSlice from "./department-slice";
import teamSlice from "./team-slice";
import employeeSlice from "./employee-slice";
const store = configureStore({
  reducer: {
    auth: authReducers,
    loader: loaderReducers,
    survey: surveySlice.reducer,
    department: departmentSlice.reducer,
    team: teamSlice.reducer,
    employee: employeeSlice.reducer,
  },
});
export default store;
