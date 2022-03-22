import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import contestService from "./contestService";
import dayjs from "dayjs";

const initialState = {
  problems: [],
  contestsList: [],
  ongoingContest: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  update: 0,
  message: "",
};

// Creates new contest.
export const createContest = createAsyncThunk(
  "contests/create",
  async (data, thunkAPI) => {
    try {
      console.log("Reached createContest in slice.");
      const token = thunkAPI.getState().auth.user.token;
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

// Get user's running contest.
export const getOngoingContest = createAsyncThunk(
  "contests/ongoing",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const ongoingContest = await contestService.getOngoingContest(token);
      const contestEndTime =
        new Date(ongoingContest.startedAt).getTime() +
        ongoingContest.duration * 60 * 1000;
      const timeStampDayjs = dayjs(contestEndTime);
      const nowDayjs = dayjs();
      if (timeStampDayjs.isBefore(nowDayjs)) {
        console.log("hee");
        await contestService.invalidateContest(ongoingContest._id, token);
        return thunkAPI.rejectWithValue("No ongoing contest found!!");
      }
      return ongoingContest;
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
  async (contestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contestService.joinContest(contestId, token);
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

// Starts a contest.
export const startContest = createAsyncThunk(
  "contests/start",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await contestService.startContest(data.id, data.problems, token);
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
      const token = thunkAPI.getState().auth.user.token;
      console.log("data", data);
      const contest = await contestService.solveProblem(
        data.contestId,
        data.timeStamp,
        data.problemName,
        data.username,
        token
      );
      return contest;
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
      })
      .addCase(getOngoingContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOngoingContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
      })
      .addCase(getOngoingContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(startContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(startContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
        state.update = state.update + 1;
      })
      .addCase(startContest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(solveProblem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(solveProblem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
        state.update = state.update + 1;
      })
      .addCase(solveProblem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(joinContest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinContest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.ongoingContest = action.payload;
        state.update = state.update + 1;
      })
      .addCase(joinContest.rejected, (state, action) => {
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
  },
});

export const { reset, resetAfterCreateContest } = contestSlice.actions;
export default contestSlice.reducer;
