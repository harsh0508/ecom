import * as React from 'react'
import './ProductTile.css'
import { useNavigate } from 'react-router-dom'
import AddCartButton from '../AddCart/AddCart.tsx'

export default function ProductTile(props){

    const navigate = useNavigate()
    return(
        <div key={props.product.id} className='card shadow' style={{color:'black'}} >
            <img src={props.product.image[0]} style={{height:'100px',aspectRatio:'2/1'}} alt="" 
            
            onClick={()=>{
                // navigate to product page
                navigate(`/pro/${props.product.id}`,{replace:false})
            }}
            />
            <p style={{color:'black'}}>{props.product.name}</p>
            <p style={{color:'black'}}>{`$ ${props.product.price}`}</p>
            <AddCartButton product = {props.product}/>
        </div>
    )
}