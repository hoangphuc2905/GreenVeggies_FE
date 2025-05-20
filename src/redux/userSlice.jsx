import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserInfo, updateUserInfo } from "../services/UserService"; // Import các hàm API

// Action lấy user từ API
export const fetchUser = createAsyncThunk("user/fetchUser", async ({ userID }, { rejectWithValue }) => {
  try {
    const response = await getUserInfo(userID); // Gọi hàm API getUserInfo
    return response; // Trả về dữ liệu người dùng
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return rejectWithValue(error.message); // Trả về lỗi
  }
});

// Action cập nhật user
export const updateUser = createAsyncThunk("user/updateUser", async ({ userID, accessToken, updatedData }, { rejectWithValue }) => {
  try {
    const response = await updateUserInfo(userID, accessToken, updatedData); // Gọi hàm API updateUserInfo
    return response; // Trả về dữ liệu người dùng đã cập nhật
  } catch (error) {
    console.error("Error updating user:", error.message);
    return rejectWithValue(error.message); // Trả về lỗi
  }
});

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Xử lý fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Xử lý updateUser
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Cập nhật thông tin người dùng
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default UserSlice.reducer;