import axios from "axios"
import Cookies from "universal-cookie"
import { updateCart } from "./ReduxStore/UserSlice.ts"

const BASE_URL:string | undefined = process.env.REACT_APP_BASE_URL



export async function signUp(userName:string,password:string , email:string){
   try{
    await axios.post(BASE_URL+'signUp',{
        name:userName,
        password:password,
        email:email
    }).then((res)=>{
        if(res.status === 500) return false
    })
    return true
   }catch(e){
    console.error(e.response.data)
    return false
   }
}

export async function login(userName:string,password:string) {
    
    try {
        const token = await axios.post(BASE_URL+'login',{
            name:userName,
            password:password
        })
        console.log(token.data.accessToken)
        const cookie = new Cookies()
        cookie.set('ac-token',token.data.accessToken)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function getUserData(token:string){
    // get user data
    try {
        const userData = await axios.get(BASE_URL+'getUser',{
            headers:{
                "ngrok-skip-browser-warning":'1231',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(userData.data)
        return userData.data
    } catch (error) {
        console.log(error)
    }
}

export async function fetchCart(user,dispatch){
    console.log(user)
    if(user.id === ''){
        // fetch from session
        let cart = JSON.parse(sessionStorage.getItem('cart')!)
        console.log(cart)
        if(cart === null || cart.length === 0 ){
            dispatch(updateCart([]))
            return
        }
        else{
            dispatch(updateCart(cart))
        }
    }
    else{
        // fetch from db
        let cart = user.cart
        if(cart === null || cart.length === 0){
            dispatch(updateCart([]))
            return
        }
        else{
            dispatch(updateCart(cart))
        }

    }
}



export async function AddAddress( amove:boolean , data , user ){
    if(amove){
        // add address
        const cookie = new Cookies()
        const token =cookie.get('ac-token')
        await axios.post(`${BASE_URL}addAddress`,{
            Authorization: `Bearer ${token}` ,
            id:user.id,
            address:JSON.stringify(data)
        })
    }
    else{
        // remove address
        const cookie = new Cookies()
        const token =cookie.get('ac-token')
        await axios.post(`${BASE_URL}removeAddress`,{
            Authorization: `Bearer ${token}` ,
            id:user.id,
            address:JSON.stringify(data)
        })
    }
}

export async function AddToCart(data,user,dispatch,increment:boolean){
    let quantity = 1
    if(increment === false){
        quantity = -1
    }
    const useData = {id:data.id,quantity:quantity,price:data.price,name:data.name,image:data.image}
    if(user.id === ''){
        // user is not verified / logged in 
        // just update normal state and put in session storage
        let cart = JSON.parse(sessionStorage.getItem('cart')!) // get from session storage
        if(cart === null || cart.length === 0){
            console.log("setting new cart data")
            cart = [useData]
            dispatch(updateCart(cart))
            cart = JSON.stringify(cart)
            sessionStorage.setItem('cart',cart)
            return
        }
        let l:number = 0
        cart!.forEach((e,i)=>{
            if(e.id === useData.id){
                console.log("id is same"+e.id)
                l +=1
                console.log(l)
                e.quantity = e.quantity + useData.quantity
                if(e.quantity === 0){
                    // remove from cart 
                    console.log("removing dtill")
                    cart.splice(i , 1)
                }
            }
           
        })
        if(l === 0){
            console.log("adding new data to cart")
            cart.push(useData)
        }
        // add to session storage to get cart
        dispatch(updateCart(cart))
        cart = JSON.stringify(cart)
        sessionStorage.setItem('cart',cart)
        
    }
    else{
        // user is verified 
        // update redux and then update db
        let cart  =JSON.parse(JSON.stringify(user.cart))
        let l:number = 0
        if(cart.length === 0){
            cart.push(useData)
        }
        else
            cart!.forEach((e,i)=>{
                if(e.id === useData.id){
                    l +=1
                    e.quantity += quantity
                    if(e.quantity === 0){
                        // remove from cart 
                        cart.splice(i , 1)
                    }
                }
                if(i === cart.length -1 && l === 0 ){
                    // end and l still 0
                    cart.push(useData)
                }
            })
        dispatch(updateCart(cart))
        const cookie = new Cookies()
        const token =cookie.get('ac-token')
        await axios.post(`${BASE_URL}addTocart`,{
            Authorization: `Bearer ${token}` ,  // get token from storage,
            cart:JSON.stringify(cart),
            uid:user.id
        })
    }
}

export async function SendPayment(val:number){
    // send user id insted of number 
    try {
        const value = JSON.stringify({"value":val})
        const cookie = new Cookies()
        const token =cookie.get('ac-token')
        const response = await axios.post(`${BASE_URL}order`,
            {
                Authorization: `Bearer ${token}` ,
                order:value
            }
        )
        return response
    } catch (error) {
        console.log(error)
    }
}


export async function VerifyPayment(res){
    console.log(res)
}



export function cartQuantity(user){
    let quantity = 0
    console.log(user)
    user.cart.forEach(element => {
        quantity =quantity+ element.quantity
    });
    console.log(`${quantity} : is the quantity`)
    if(Number.isNaN(quantity))
        return 0
    return quantity
}

export function cartPrice(user){
    let price = 0
    console.log(user)
    user.cart.forEach(element => {
        let p = parseFloat(element.price)
        price =price+ p
    });
    return price
}



export async function addReview(data,id:string){
    const cookie = new Cookies()
    const token =cookie.get('ac-token')
    try {
        const response = await axios.post(`${BASE_URL}product/review`,{
            "Authorization"  :`Bearer ${token}`,
            "id": id,
            "review":{
                "rating": data.rating , 
                "review":data.review

            }
        })
        console.log(response)
        return response.data.res
    } catch (error) {
        // handle this 
        console.log(error)
        return false
    }
}


export async function getSearchProduct(str:string){
    try {
        const response = await axios.get(`${BASE_URL}search/${str}`,{
            headers:{
                "ngrok-skip-browser-warning":'1231'
            }
        })
        return response.data
    } catch (error) {
        return []
    }
}