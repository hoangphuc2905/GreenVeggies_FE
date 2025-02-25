import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserInfo, updateUserInfo } from "../api/api"; // Thêm updateUserInfo

// Action lấy user từ API
export const fetchUser = createAsyncThunk("user/fetchUser", async ({ userId, token }) => {
  return await getUserInfo(userId, token);
});

// Action cập nhật user
export const updateUser = createAsyncThunk("user/updateUser", async ({ userId, token, updatedData }) => {
  return await updateUserInfo(userId, token, updatedData);
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, status: "idle", error: null },
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
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload; // Cập nhật user mới vào Redux
      });
  },
});

export default userSlice.reducer;
