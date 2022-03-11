import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contestReducer from "../features/contest/contestSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contest: contestReducer,
  },
});
