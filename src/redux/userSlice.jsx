import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action lấy user từ API
export const fetchUser = createAsyncThunk("user/fetchUser", async ({ userID, token }) => {
  try {
    const response = await axios.get(`http://localhost:8002/api/user/${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error.response ? error.response.data : error.message);
    throw error;
  }
});


const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });

  },
});

export default userSlice.reducer;