import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../consts";

export const getTeams = createAsyncThunk("fetchTeams", async (obj) => {
    const response = await fetch(`${BASE_URL}/team/getAll/${obj.orgId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + obj.token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.teams;
 })

const teamSlice = createSlice({
    name: "team",
    initialState: {
        teams: [],
        status: "idle",
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(getTeams.pending, (state) => {
            state.status = "loading";
        })
            .addCase(getTeams.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.teams = action.payload;
        })
        .addCase(getTeams.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
    },
});
export const teamActions = teamSlice.actions;
export default teamSlice;