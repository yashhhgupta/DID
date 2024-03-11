import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../consts";

export const getDepartments = createAsyncThunk("fetchDepartments", async (obj) => {
  const response = await fetch(`${BASE_URL}/department/getAll/${obj.orgId}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + obj.token,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  let updatedDepartments = data.departments.map((department) => {
    return {
      value: department._id,
      label: department.name,
    };
  });
  return updatedDepartments;
});


const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    status: "idle",
    error: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(getDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export const departmentActions = departmentSlice.actions;

export default departmentSlice;
