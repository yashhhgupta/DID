import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../consts";

export const getEmployees = createAsyncThunk("fetchEmployees", async (obj) => {
  const response = await fetch(`${BASE_URL}/admin/getAllUsers/${obj.orgId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + obj.token,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.users;
});

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmployees.fulfilled, (state, action) => {

        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const teamActions = employeeSlice.actions;
export default employeeSlice;
