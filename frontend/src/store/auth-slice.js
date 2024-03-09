import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    isLoggedIn: false,
    orgId: null,
    isAdmin: false,
    token: null,
  },
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.orgId = action.payload.orgId;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.isAdmin = action.payload.userId == action.payload.orgId;
      
    },
    logout: (state) => {
      state.userId = null;
      state.orgId = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
    }
  },
});

export const {login,logout,check} = authSlice.actions;
export default authSlice.reducer;
