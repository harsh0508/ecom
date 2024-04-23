import { useNavigate, useParams } from 'react-router-dom'
import './ProductPage.css'
import * as React from 'react'
import { getProduct } from '../../Providers/MainPageProvide.ts'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store.ts'
import AddCartButton from '../../Component/AddCart/AddCart.tsx'
import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addReview } from '../../Providers/UserProvider.ts'
import { addText } from '../../Providers/ReduxStore/WebSlice.ts'



const FormSchema = z.object({
    review:z.string().min(10),
    rating:z.string().min(1).max(5)
});

type FormInput = z.infer<typeof FormSchema>;

export default function Productpage(){

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            review: '',
            rating: '0'
        },
    });

    let {pid} = useParams()
    const [data,setData] = React.useState<null | any>(null)
    const [rating,setRating] = React.useState('')
    const user = useSelector((state : RootState)=> state.user)
    const dispatch = useDispatch<AppDispatch>()
    

    const averageRating = ()=>{
        
        if(data.reviews.length === 0) return 0
        let t = 0
        dispatch(addText(`Fetching review. Calculating average review.`))
        const total = data.reviews.map((e)=>{
            if(e.rating){
                t = t + e.rating
            }
            return t
        })
        return total/data.reviews.length

    }

    

    React.useEffect(()=>{
        const getData = async()=>{
            // fetch data
            dispatch(addText(`Fetching product data from database.`))
            const d = await getProduct(pid!)
            setData(d)   
        }
        getData()
    },[user])

    
    const handleRating = ()=>{
        const input = document.getElementById('rating_input')
        // console.log(input)
        input?.addEventListener('input',(e)=>{
            console.log(e.target.value)
            setRating(e.target.value)
        })
    }

    const navigate = useNavigate()

    return(
        <>
            {(data === null)?<div className='loader'/>:
                <>
                <div className='' style={{color:'black'}}>
                    <div className=''>
                        <div className='main-photo'><img style={{height:'100px',aspectRatio:'1/1',objectFit:'contain'}} src={data.image[0]} alt="" /></div>
                        <div className='sub-photo'></div>
                    </div>
                    <div className=''>
                        <AddCartButton product = {data}/>
                        <h1>{data.name}</h1>
                        <h4>Rated : {averageRating()} | Total Reviews :{data.reviews.length}</h4>
                        <h4>
                            Company : {data.company}
                        </h4>
                        <h4>${data.price}</h4>
                        <div >
                            {Object.keys(data.types[0]).map(k=><ul>
                            {k} : {data.types[0][k]}
                        </ul>)}
                            {/* types not able to get */}
                        </div>
                        <p>{data.description}</p>
                        {/* for each detail write detail */}
                        <ul>
                            {Object.keys(data.detail[0]).map(k=><li>
                                {k} : {data.detail[0][k]}
                            </li>)}
                        </ul>
                    </div>
                </div>
                <div>
                    {/* make caresoul of similar items  */}
                </div>
                {/* if logged in write review , else give a login prompt */}
                {(user.id !== '')?
                    <form onSubmit={handleSubmit((d)=>addReview(d,data.id))}>
                        <input onChange={(val)=>handleRating()} id='rating_input' type='range' min={1} max={5} step={0.5} {...register('rating')}></input>
                        <p>{rating+ " star"}</p>
                        {errors?.rating?.message && <p>{errors.rating.message}</p>}
                        <input type='text' {...register('review')}></input>
                        {errors?.review?.message && <p>{errors.review.message}</p>}
                        <button>Submit</button>
                    </form>
                    :
                    <button onClick={()=>navigate('/login')}>Login</button>
                }

                {}<div className='product-review'>
                    {/* map review here */}
                    {data.reviews.map(e=><p>{e.date} : {e.rating} : {e.uid} : {e.review}</p>)}
                </div>
                </>
            }
        </>
    )
}