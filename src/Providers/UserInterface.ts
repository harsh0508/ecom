export interface user{
    id:string,
    name:string,
    email:string,
    address:[],
    orders:[],
    cart:[],
    password:string,
    created:string,
    updated:string
}

export interface products{
    id:string,
    category:string,
    name:string,
    types:Map<string,number>[], // large:29 - type and its price
    reviews:Map<string,Map<string,string>>[], //username:{rating:5,review:"good item"}
    price:number,
    discount:number,
    company:string,
    image:string[],
    description:string,
    detail:Map<string,string>[] //modelNo:'',ASIN:'',dimension:''
}