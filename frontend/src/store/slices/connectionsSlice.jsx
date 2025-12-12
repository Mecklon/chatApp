import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import api from "../../api/api";
import { SiTaketwointeractivesoftware } from "react-icons/si";

const initialState = {
  connections: [],
  connectionSet: [],
  connectionsFetchStatus: false,
  connectionsFetchError: null,
  requests: [],
  requestsFetchStatus: false,
  requestsFetchError: null,
  hasMoreRequests: true,
  groups: [],
  groupSet: [],
  groupsFetchStatus: false,
  groupsFetchError: null,
};

export const getConnections = createAsyncThunk(
  "connections/getConnections",
  async () => {
    const res = await api.get("/getConnections");
    return res.data;
  }
);

export const getRequests = createAsyncThunk(
  "connections/getRequests",
  async (cursor) => {
    const res = await api.get("/getRequests/" + cursor);
    return res.data;
  }
);

export const setUnseenZero = createAsyncThunk(
  "connections/setUnseenZero",
  async (sender) => {
    await api.get("/setSeenMessage/" + sender);
    return sender;
  }
);

export const setUnseenGroupZero = createAsyncThunk(
  "connections/setUnseenGroupZero",
  async (groupId) => {
    await api.get("/sendGroupOpened/" + groupId);
    return groupId;
  }
);

export const getGroups = createAsyncThunk("connections/getGroups", async () => {
  const res = await api.get("/getGroups");
  return res.data;
});




const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    addRequest: (state, action) => {
      state.requests.unshift({
        id: nanoid(),
        ...action.payload,
      });
    },
    addConnection: (state, action) => {
      state.connections.unshift({
        id: nanoid(),
        ...action.payload,
      });
      state.connectionSet.push(action.payload.name);
    },
    removeRequest: (state, action) => {
      state.requests = state.requests.filter((request) => {
        return request.id !== action.payload;
      });
    },
    incrementUnseen: (state, action) => {
      for (let i = 0; i < state.connections.length; i++) {
        if (state.connections[i].name === action.payload) {
          state.connections[i].pending++;
          break;
        }
      }
    },
    updateLatestMessage: (state, action) => {
      let contact = action.payload.contact;
      for (let i = 0; i < state.connections.length; i++) {
        if (state.connections[i].name == contact) {
          state.connections[i].postedOn = action.payload.time;
          state.connections[i].content = action.payload.content;
          state.connections[i].sender = action.payload.sender;
        }
      }
    },
    updateLatestGroupMessage: (state, action) => {
      let id = action.payload.id;
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].id === id) {
          state.groups[i].lastMessageTime = action.payload.time;
          state.groups[i].latestMessage = action.payload.content;
          state.groups[i].sender = action.payload.sender;
        }
      }
    },
    setActivityStatus: (state, action) => {
      for (let i = 0; i < state.connections.length; i++) {
        if (state.connections[i].name === action.payload.name) {
          state.connections[i].online = action.payload.online;
        }
      }
    },
    addGroup: (state, action) => {
      state.groups.unshift(action.payload);
    },
    incrementGroupUnseen: (state, action) => {
      for (let i = 0; i < state.groups.length; i++) {
        if (state.groups[i].id === action.payload.groupId) {
          state.groups[i].pending++;
          break;
        }
      }
    },
    clearConnections: () => {
      return initialState;
    },
    deleteGroup:(state, action)=>{
      const id = action.payload
      state.groups = state.groups.filter(group=> group.id!=id)
    }
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConnections.pending, (state) => {
        state.connectionsFetchStatus = true;
      })
      .addCase(getConnections.rejected, (state, action) => {
        state.connectionsFetchStatus = false;
        state.connectionsFetchError = action.error.message;
      })
      .addCase(getConnections.fulfilled, (state, action) => {
        state.connectionsFetchStatus = false;
        state.connectionsFetchError = null;
        const connectionWithId = action.payload.map((connection) => {
          return {
            id: nanoid(),
            ...connection,
          };
        });

        state.connections = connectionWithId;
        state.connectionSet = state.connections.map(
          (connection) => connection.name
        );
      })
      .addCase(getRequests.pending, (state) => {
        state.requestsFetchStatus = true;
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.requestsFetchStatus = false;
        state.requestsFetchError = action.error.message;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.requestsFetchStatus = false;
        state.requestsFetchError = null;
        const requestsWithId = action.payload.map((request) => {
          return { ...request, id: nanoid() };
        });
        state.requests = [...state.requests, ...requestsWithId];
        if (action.payload.length < 20) {
          state.hasMoreRequests = false;
        }
      })
      .addCase(setUnseenZero.fulfilled, (state, action) => {
        for (let i = 0; i < state.connections.length; i++) {
          if (state.connections[i].name === action.payload) {
            state.connections[i].pending = 0;
          }
        }
      })
      .addCase(setUnseenGroupZero.fulfilled, (state, action) => {
        for (let i = 0; i < state.groups.length; i++) {
          if (state.groups[i].id === action.payload) {
            state.groups[i].pending = 0;
          }
        }
      })
      .addCase(getGroups.pending, (state, action) => {
        state.groupsFetchStatus = true;
        state.groupsFetchError = null;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.groupsFetchStatus = false;
        state.groupsFetchError = action.error;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.groupsFetchError = null;
        state.groupsFetchStatus = false;
        state.groups = action.payload;
        state.groupSet = action.payload.map((group) => group.id);
      });
  },
});

export const {
  addRequest,
  addConnection,
  updateLatestGroupMessage,
  removeRequest,
  incrementUnseen,
  updateLatestMessage,
  setActivityStatus,
  addGroup,
  incrementGroupUnseen,
  clearConnections,
  deleteGroup
  
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
