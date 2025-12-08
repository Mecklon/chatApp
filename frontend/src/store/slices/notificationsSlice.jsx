import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/api";
import { SiTaketwointeractivesoftware } from "react-icons/si";

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (cursor) => {
    const res = await api.get("/getNotifications/" + cursor);
    return res.data;
  }
);


const initialState =  {
    hasMore: true,
    notifications: [],
    loading: false,
    error: null,
  }

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: nanoid(),
        ...action.payload,
      });
    },
    clearNotification: (state, action)=>{
      return initialState
    }
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

export const {addNotification, clearNotification} = notificationsSlice.actions
export default notificationsSlice.reducer;
