import axios from "axios"


// this the base url of our node 
const BASE_URL : string | undefined = process.env.REACT_APP_BASE_URL

export interface Banner {
    date : string,
    id : string , 
    image : string,
    goto : string,
    eventName : string
}

export interface RowData {
    id:string,
    head:string,
    goto: string,
    image : string,
}

export const getRowOne  = async()=>{
    //  we get row one data from node js
    console.log(BASE_URL)
    const data = (await axios.get(BASE_URL+'getGridOne',{
        headers:{
            "ngrok-skip-browser-warning":'1231'
        }
    })).data

    data.forEach(element => {
        console.log(element)
    });
    
    //  data : RowData[] = []
    return data
}


export const getRowTwo = async()=>{
    // get row two
    const data : RowData[] = []
    return data
}


export const getSale = async()=>{
    // get sale data and detail with link
    const data  =  (await axios.get(`${BASE_URL}getBanner`,{
        headers:{
            "ngrok-skip-browser-warning":'1231'
        }
    })).data as Banner
    // console.log(BASE_URL)
    // console.log(data)
    return data
}



export const getProducts = async(id:string,page:number,filter:{})=>{
    console.log("id is :"+id)
    const fltr = JSON.stringify(filter)
    console.log(fltr)
    const data:[] = (await axios.get(BASE_URL+`products/${id}/${page}/${fltr}`,{
        headers:{
            "ngrok-skip-browser-warning":'1231',
        },
    })).data
    console.log(data)
    return data
}

export const getProduct = async(id:string)=>{
    const productData = (await axios.get(`${BASE_URL}product/${id}`,{
        headers:{
            "ngrok-skip-browser-warning":'1231',
        }
    })).data
    console.log(productData)
    return productData
}


export async function getSearch(e){
    const productList = (await axios.get(`${BASE_URL}search/${e}`,{
        headers:{
            "ngrok-skip-browser-warning":'1231',
        }
    })).data
    console.log(productList)
    return productList
}