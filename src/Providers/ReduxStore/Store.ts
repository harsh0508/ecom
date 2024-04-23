import { configureStore } from "@reduxjs/toolkit";
import userReducer from './UserSlice.ts'
import filterReducer from "./FilterSlice.ts";
import webReducer from './WebSlice.ts'

export const store = configureStore({
    
    reducer:{
        user: userReducer,
        filter :  filterReducer,
        web: webReducer
    }

})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch =  typeof store.dispatch