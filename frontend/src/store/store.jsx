import { configureStore } from "@reduxjs/toolkit";
import connectionsReducer from './slices/connectionsSlice'
import notificationsReducer from './slices/notificationsSlice'
import chatReducer from './slices/chatSlice'
import tileReducer from './slices/TileSlice'

export const store = configureStore({
    reducer:{
        connection:connectionsReducer,
        notification:notificationsReducer,
        chat: chatReducer,
        tile: tileReducer
    }
})