import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/api";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({formData,id}) => {
    const res = await api.post("/sendMessage", formData);
    return {id, ...res.data};
  }
);

export const getMessages = createAsyncThunk(
  "chat/getMessage",
  async ({username1, username2, cursor}) => {
    const res = await api.post("/getChats", { username1, username2, cursor });
    return res.data;
  }
);



const chatSlice = createSlice({
  name: "chat",
  initialState: {
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
  },
  reducers: {
    setPrivateRoom: (state, action) => {
      state.id = action.payload.id;
      state.chats = [];
      state.userInfo = action.payload;
      state.grpInfo = null;
      state.isPrivate = true;
    },
    addMessage :(state,action)=>{
      state.chats.push({id: nanoid(),...action.payload})
      state.pending++;
      state.reached++;
    },
    addReceivedMessage: (state,action)=>{
      state.chats.push({id: nanoid(),...action.payload})
    },
    setReachedZero: (state,action)=>{
      if(state.isPrivate && state.userInfo.name === action.payload){
        state.reached = 0;
      }
    },
    setPendingZero: (state,action)=>{
      if(state.isPrivate && state.userInfo.name === action.payload){
        state.pending = 0;
      }
    },
    setChatActivityStatus: (state,action)=>{
      if(state.userInfo && state.userInfo.name===action.payload.name){
        state.userInfo.online = action.payload.online;
        state.reached = 0;
      }
    },
    setGroup : (state, action)=>{
      state.id = action.payload.id;
      state.chats = [];
      state.userInfo = null;
      state.grpInfo = action.payload;
      state.isPrivate = false;
    }
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
        state.chats = state.chats.map(chat=>{
          return chat.id === action.payload.id? action.payload: chat
        })
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
        let chatsWithId = action.payload.chats.map(chat=> {
          return {
            id: nanoid(),
            ...chat
          }
        })
       
        chatsWithId.reverse()
        state.pending = action.payload.pending;
        state.reached = action.payload.reached;
        state.chats = [...chatsWithId, ...state.chats]
        state.userInfo = {...state.userInfo, reached: action.payload.reached}
        
      });
  },
});

export const { setPrivateRoom,addMessage,addReceivedMessage,setPendingZero,setReachedZero,setChatActivityStatus,setGroup} = chatSlice.actions;
export default chatSlice.reducer;
