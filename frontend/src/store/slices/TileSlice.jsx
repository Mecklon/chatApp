import { configureStore, createSlice } from "@reduxjs/toolkit";

const tileSlice = createSlice({
    name: "tile",
    initialState: {
        expanded: false
    },
    reducers:{
        setExpanded: (state, action)=>{
            state.expanded = action.payload
        }
    }
})

export const {setExpanded} = tileSlice.actions;
export default tileSlice.reducer;
