import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestService from "./contestService";

const initialState = {
  problems: [],
  contestsList: [],
  ongoingContest: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Creates new contest.
export const createContest = createAsyncThunk(
  "contests/create",
  async (data, thunkAPI) => {
    try {
      console.log("Reached createContest in slice.");
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjMwYTFjMzVmZDkwZDc5MDA5ZjI3MSIsImlhdCI6MTY0NjU1ODA0OCwiZXhwIjoxNjQ5MTUwMDQ4fQ.B_VRSKE9cC3oDCQVJYflLo8WlE4y-rC9glh3CT-jXH4";
      return await contestService.createContest(data, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user's list of contests.
export const getContests = createAsyncThunk(
  "contests/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contestService.getContests(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a user in the ongoing contest.
export const joinContest = createAsyncThunk(
  "contests/join",
  async (data, thunkAPI) => {
    try {
      console.log("Goal update in contestSlice was called!");
      const token = thunkAPI.getState().auth.user.token;
      const goal = await contestService.joinContest(data.id, data.text, token);
      console.log(goal);
      return goal;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Marks a problem as solved in an ongoing contest.
export const solveProblem = createAsyncThunk(
  "contests/solve",
  async (data, thunkAPI) => {
    try {
      console.log("Goal update in contestSlice was called!");
      const token = thunkAPI.getState().auth.user.token;
      const goal = await contestService.solveProblem(data.id, data.text, token);
      console.log(goal);
      return goal;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const contestSlice = createSlice({
  name: "contest",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetAfterCreateContest: (state) => {
      return { ...initialState, ongoingContest: state.ongoingContest };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.contestsList.push(action.payload);
        state.ongoingContest = action.payload;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
    // .addCase(getContests.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(getContests.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.contestsList = action.payload;
    // })
    // .addCase(getContests.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload;
    // })
    // .addCase(solveProblem.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(solveProblem.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.ongoingContest = action.payload;
    // })
    // .addCase(solveProblem.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload;
    // })
    // .addCase(joinContest.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(joinContest.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.ongoingContest = action.payload;
    // })
    // .addCase(joinContest.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.isError = true;
    //   state.message = action.payload;
    // });
  },
});

export const { reset, resetAfterCreateContest } = contestSlice.actions;
export default contestSlice.reducer;
