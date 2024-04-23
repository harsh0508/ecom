
import { createSlice } from "@reduxjs/toolkit"


const initilFilter={}


const filterSlice = createSlice({
    name:'filter',
    initialState:initilFilter,
    reducers:{
        setFilter:(state,action)=>{
            const newFilter = action.payload
            return newFilter
        }
    }
})


export const {setFilter}  = filterSlice.actions

export default filterSlice.reducer