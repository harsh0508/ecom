import {  createSlice } from "@reduxjs/toolkit";
import { user } from "../UserInterface.ts";
import Cookies from "universal-cookie";



const initialUser : user ={
    id:'',
    name:'',
    address:[],
    cart:[],
    created: '',
    email:'',
    orders:[],
    password:'',
    updated:''
}


const userSlice =  createSlice({
    name:'user',
    initialState:initialUser,
    reducers:{
        storeUser:(state,action)=>{
            // get state value as value fetched 
            console.log(state.id)
            const user:user = {
                id:action.payload.id,
                name:action.payload.name,
                address:action.payload.address,
                cart:action.payload.cart,
                created:'',
                email:action.payload.email,
                orders:action.payload.orders,
                password:action.payload.password,
                updated:''
            }
            // console.log(user)
            return user
        },
        logout:(state)=>{
            // remove user state
            const cookie = new Cookies()
            cookie.set('ac-token',undefined)
            const user: user ={
                address:[],
                cart:[],
                created:'',
                email:'',
                id:'',
                name:'',
                orders:[],
                password:'',
                updated:''

            }
            return user
        },
        updateCart:(state,action)=>{
            // update cart
            console.log(action)
            const user:user = {
                id:state.id,
                name:state.name,
                address:state.address,
                cart:action.payload,
                created:'',
                email:state.email,
                orders:state.orders,
                password:state.password,
                updated:''
            }
            console.log(user)
            return user
        },
        updateAddress:(state,action)=>{

            let newAddress:[] = []

            state.address.map(e=>newAddress.push(e))

            newAddress.push(action.payload)

            const user:user ={
                id:state.id,
                name:state.name,
                address:newAddress,
                cart:state.cart,
                created:'',
                email:state.email,
                orders:state.orders,
                password:state.password,
                updated:''
            }

            return user
        }

    }
})


export const {storeUser , logout  , updateCart} = userSlice.actions

export default userSlice.reducer