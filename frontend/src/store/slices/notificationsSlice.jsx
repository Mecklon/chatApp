import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (cursor) => {
    const res = await api.get("/getNotifications/" + cursor);
    return res.data;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    hasMore: true,
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: nanoid(),
        ...action.payload,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const notificationsWithId = action.payload.map((notification) => {
          return {
            ...notification,
            id: nanoid(),
          };
        });
        state.notifications = [...state.notifications, ...notificationsWithId];
        if (action.payload.length < 20) {
          state.hasMore = false;
        }
      });
  },
});

export const {addNotification} = notificationsSlice.actions
export default notificationsSlice.reducer;
