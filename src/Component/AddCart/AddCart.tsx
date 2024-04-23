import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store'
import { AddToCart } from '../../Providers/UserProvider.ts'


export default function AddCartButton(props){
    
    const user = useSelector((state: RootState)=>state.user)
    const dispatch = useDispatch<AppDispatch>()
    const [inCart,setInCart] = React.useState<number | boolean>(false)

    React.useEffect(()=>{

        const checkState = ()=>{
            user.cart.forEach((e,i)=>{
                // @ts-expect-error
                if(e.id === props.product.id){
                    setInCart(i)
                }
            })
        }
        checkState()
        
    },[props.product.id, user.cart])

    return(
        <>
            {(inCart === false ) ?
            <button onClick={()=>AddToCart(props.product,user,dispatch,true)}>Add to Cart</button>
            :
            <div>
                <button  onClick={()=>AddToCart(props.product,user,dispatch,true)}>+</button>
                <p>{
                    (!user.cart[inCart].quantity)?
                        0
                    :
                user.cart[inCart].quantity}</p>
                <button  onClick={()=>
                    {
                        if(user.cart[inCart].quantity === 1){
                            setInCart(false)
                        }
                        AddToCart(props.product,user,dispatch,false)
                    }
                    }>-</button>
            </div>
            }
            
        </>
    )
}