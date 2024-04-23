import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store'
import { useNavigate } from 'react-router-dom'
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {AddAddress, SendPayment, VerifyPayment, cartPrice} from '../../Providers/UserProvider.ts'
import useRazorpay from 'react-razorpay'
import './CheckOut.css'
import { addText } from '../../Providers/ReduxStore/WebSlice.ts';




const statesAndUTs = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi (National Capital Territory of Delhi)",
    "Puducherry (Pondicherry)",
    "Ladakh",
    "Lakshadweep"
  ];
  

const AddressSchema= z.object({
    adddressLine1 : z.string().min(10).max(50),
    addressLine2 : z.string().min(0),
    pincode: z.string().regex(new RegExp('^[1-9][0-9]{5}$'),"Not proper pincode"),
    mobileNumber : z.string().max(10).min(10),
    city : z.string().min(3),
    state : z.string().min(3)
})

type AddressInput  = z.infer<typeof AddressSchema>





function AddressBox(props){
    return(
        <div className='address-box'>
            <p>{`Address : ${props.data.adddressLine1} , ${props.data.addressLine2}`}</p>
            <p>{`Mobile Number : ${props.data.mobileNumber}`}</p>
            <p>{`City : ${props.data.city}`}</p>
            <p>{`State : ${props.data.state}`}</p>
        </div>
    )
}




export default function CheckOut(){


    const user = useSelector((state : RootState)=> state.user)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [RazorPay] = useRazorpay()

    React.useEffect(()=>{
       if(user.id === ''){
            dispatch(addText(`User Id not available or not logged in . Redirecting to Login page.`))
            navigate('/login',{state:{Text:'Login to order'}})
       }
    },[])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressInput>({
        resolver:zodResolver(AddressSchema),
        defaultValues:{
            adddressLine1:'',
            addressLine2:'',
            city:'',
            mobileNumber:'',
            pincode:'',
            state:''
        }
    })


    const AandR =async(d,user)=>{
        await AddAddress(true,d,user)
        navigate('/checkout')
    }


    const [box,showBox] = React.useState(false)

    const [selected,setSelected] = React.useState(-1)

    const [pay,setPay] = React.useState(false)


    const payment = async()=>{
        if(selected === -1)
        {
            setSelected(-2)
            return
        }
        setPay(true)
    }

    const handlePayment = async(val)=>{
       let res = await SendPayment(val)
       res = res?.data
       console.log(res)
       var options = {
            "key": "rzp_test_CqIvn8cJaYhjKq", // Enter the Key ID generated from the Dashboard
            "amount": res?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Harsh Rai", //your business name
            "description": "Test Transaction",
            "image": "",
            "order_id": res?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function(response){
                
                try {
                    const verify = await VerifyPayment(response)
                    console.log(verify)
                } catch (error) {
                    console.log(error)
                }
                
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
            },
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                "name": "Your Name", //your customer's name
                "email": "abc@xyz.com", 
                "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
       }
       const rzp1 = new RazorPay(options)
       rzp1.open()
    }



    return(
        <div className='checkout'>

            {(box)?<div className='address-modal'>
                <button onClick={()=>showBox(false)}>x</button>
                <form onSubmit={handleSubmit((d)=>AandR(d,user))}>
                    <p>Add your address</p>
                    <input type="text" id="ad1"   {...register('adddressLine1')}/>
                    {errors?.adddressLine1?.message && <p>{errors.adddressLine1.message}</p>}

                    <p>2nd line address</p>
                    <input type="text" id="ad2"   {...register('addressLine2')}/>
                    {errors?.addressLine2?.message && <p>{errors.addressLine2?.message}</p>}

                    <p>Mobile Number</p>
                    <input type="text" id="mb"   {...register('mobileNumber')}/>
                    {errors?.mobileNumber?.message && <p>{errors.mobileNumber?.message}</p>}


                    <p>Enter Pincode</p>
                    <input type="text" id="pin"   {...register('pincode')}/>
                    {errors?.pincode?.message && <p>{errors.pincode?.message}</p>}

                    <p>Enter city</p>
                    <input type="text" id="city"   {...register('city')}/>
                    {errors?.city?.message && <p>{errors.city?.message}</p>}

                    <p>Enter State</p>
                    <select id="state" {...register('state')}>
                        {
                            statesAndUTs.map((e)=><option value={e}>{e}</option>)
                        }
                    </select>
                    {errors?.state?.message && <p>{errors.state?.message}</p>}
                    <button type='submit'>Submit</button>
                </form>
            </div>:<></>}

            {(!pay)?<div className='user-address'>
                {
                    (user.address.length === 0)?
                    <button onClick={()=>showBox(!box)}>Add user Address</button>
                    :
                    <div>
                        {user.address.map((e,i)=><div 
                        style={{border:(i === selected)?'2px solid blue':'none',width:'250px',margin:'auto',padding:'1%'}}
                         onClick={()=>{
                            // set selected 
                            setSelected(i)
                        }}>
                            <AddressBox key={i} data={e}/></div>)}
                        <button onClick={()=>{showBox(!box)}}>Add user address</button>
                        <button onClick={()=>payment()}>Proceed to payment</button>
                        {(selected === -2)?<p>Select one address before procedding</p>:<></>}
                    </div>
                }
            </div>:<div className='user-payment'>
                <p onClick={()=>setPay(false)}>Back</p>
                <button onClick={()=>handlePayment(cartPrice(user))}>
                    {`Pay  ₹ ${cartPrice(user)}`}
                </button>
            </div>}
            
        </div>
    )
}