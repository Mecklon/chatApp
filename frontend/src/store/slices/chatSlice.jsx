import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/api";
import { SiTaketwointeractivesoftware } from "react-icons/si";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ formData, id, isPrivate }) => {
    let res;
    if (isPrivate) {
      res = await api.post("/sendMessage", formData);
    } else {
      res = await api.post("/sendGroupMessage", formData);
    }
    return { id, ...res.data };
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessage",
  async ({ username1, username2, cursor }) => {
    const res = await api.post("/getChats", { username1, username2, cursor });
    return res.data;
  }
);

export const getGroupMessages = createAsyncThunk(
  "chat/getGroupMessages",
  async ({ id, cursor }) => {
    const res = await api.post("/getGroupMessages", { id, cursor });
    return res.data;
  }
);

export const sendGroupReceived = createAsyncThunk(
  "chat/sendGroupReceived",
  async ({ groupId }) => {
    await api.post("/sendGroupReceived/" + groupId);
  }
);

export const sendGroupSeen = createAsyncThunk(
  "chat/sendGroupSeen",
  async ({ groupId }) => {
    await api.post("/sendGroupSeen/" + groupId);
  }
);

const initialState = {
  id: null,
  chats: [],
  pending: 0,
  reached: 0,
  userInfo: null,
  grpInfo: null,
  isPrivate: null,
  sendingMessage: false,
  sendMessageError: null,
  gettingMessage: false,
  gettingMessageError: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPrivateRoom: (state, action) => {
      state.id = action.payload.id;
      state.chats = [];
      state.userInfo = action.payload;
      state.grpInfo = null;
      state.isPrivate = true;
    },
    addMessage: (state, action) => {
      console.log(action.payload)
      state.chats.push(action.payload );
      state.pending++;
      state.reached++;
    },
    addReceivedMessage: (state, action) => {
      state.chats.push({ id: nanoid(), ...action.payload });
    },
    setReachedZero: (state, action) => {
      if (state.isPrivate && state.userInfo.name === action.payload) {
        state.reached = 0;
      }
    },
    setPendingZero: (state, action) => {
      if (state.isPrivate && state.userInfo.name === action.payload) {
        state.pending = 0;
      }
    },
    setChatActivityStatus: (state, action) => {
      if (state.userInfo && state.userInfo.name === action.payload.name) {
        state.userInfo.online = action.payload.online;
        state.reached = 0;
      }
    },
    setGroup: (state, action) => {
      state.id = action.payload.id;
      state.chats = [];
      state.userInfo = null;
      state.grpInfo = action.payload;
      state.isPrivate = false;
    },
    addGroupMessage: (state, action) => {
      state.chats.push({ id: nanoid(), ...action.payload.message });
      state.pending++;
      state.reached++;
    },
    updateGroupMaxValues: (state, action) => {
      if (
        state.isPrivate ||
        !state.grpInfo ||
        state.grpInfo.id !== action.payload.groupId
      )
        return;
      state.pending = action.payload.pending;
      state.reached = action.payload.reached;
    },
    clearChats: (state, action) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.sendMessageError = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.sendMessageError = null;
        state.chats = state.chats.map((chat) => {
          if (chat.id === action.payload.id) {
            chat.media.forEach((multimedia) =>
              URL.revokeObjectURL(multimedia.preview)
            );
            return action.payload;
          } else {
            return chat;
          }
        });
      })
      .addCase(getMessages.pending, (state, action) => {
        state.gettingMessage = true;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.gettingMessage = false;
        state.gettingMessageError = action.error.message;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.gettingMessage = false;
        state.gettingMessageError = null;
        let chatsWithId = action.payload.chats.map((chat) => {
          return {
            id: nanoid(),
            ...chat,
          };
        });

        chatsWithId.reverse();
        state.pending = action.payload.pending;
        state.reached = action.payload.reached;
        state.chats = [...chatsWithId, ...state.chats];
        state.userInfo = { ...state.userInfo, reached: action.payload.reached };
      })
      .addCase(getGroupMessages.rejected, (state, action) => {
        state.gettingMessage = false;
        state.gettingMessageError = action.error.message;
      })
      .addCase(getGroupMessages.pending, (state, action) => {
        state.gettingMessage = true;
        state.gettingMessageError = null;
      })
      .addCase(getGroupMessages.fulfilled, (state, action) => {
        state.gettingMessage = false;
        state.gettingMessageError = null;
        let chatsWithId = action.payload.chats.map((chat) => {
          return {
            id: nanoid(),
            ...chat,
          };
        });

        chatsWithId.reverse();
        state.pending = action.payload.pending;
        state.reached = action.payload.reached;
        state.chats = [...chatsWithId, ...state.chats];
        state.userInfo = { ...state.userInfo, reached: action.payload.reached };
      });
  },
});

export const {
  setPrivateRoom,
  addMessage,
  addReceivedMessage,
  setPendingZero,
  setReachedZero,
  setChatActivityStatus,
  setGroup,
  addGroupMessage,
  updateGroupMaxValues,
  clearChats,
} = chatSlice.actions;
export default chatSlice.reducer;
