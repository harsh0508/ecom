import * as React from  'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store'
import { cartPrice } from '../../Providers/UserProvider.ts'
import { useNavigate } from 'react-router-dom'
import { addText } from '../../Providers/ReduxStore/WebSlice.ts'

export default function CartPage(){
    const user = useSelector((state : RootState)=> state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    React.useEffect(()=>{
        dispatch(addText(`Fetching cart details.`))
        console.log(user.cart)
    },[user])
    return(
        <div>
            <div>
                <h1>Shopping Cart</h1>
                {user.cart.map(e=><div>
                    <p>{e.name}</p>
                    <p>{e.quantity}</p>
                </div>)}
            </div>
            <div>
                <p>SubTotal:  ${cartPrice(user)}</p>
                <button onClick={()=>navigate('/checkout')}>CheckOut</button>
            </div>
        </div>
    )
}