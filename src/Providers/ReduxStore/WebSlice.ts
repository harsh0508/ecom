import { createSlice } from "@reduxjs/toolkit"


interface webState {
    text: string[]
}

const initialState:webState = {
    text:["Preparing everything....","Scroll down to see what is happening"]
}


const webSlice = createSlice({
    name:'web',
    initialState:initialState,
    reducers:{
        addText:(state,action)=>{
            let newText = state.text
            newText = [...newText , action.payload]
            
            let newWebState:webState={
                text:newText
            }

            return newWebState

        }
    }
})


export const {addText} = webSlice.actions

export default webSlice.reducer