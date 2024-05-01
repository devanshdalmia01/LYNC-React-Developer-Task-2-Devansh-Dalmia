import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
    name: "data",
    initialState: {
        mainExplorer: [],
        recycleBin: [],
    },
    reducers: {},
});

export const {} = dataSlice.actions;

export default dataSlice.reducer;
