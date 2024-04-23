import * as React from 'react'
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store';
import { setFilter } from '../../Providers/ReduxStore/FilterSlice.ts';


const FilterSchema= z.object({
    review:  z.string().max(4.5).min(0) || null,
    brands: z.string().array(),
    type:z.string(),
    price: z.string().min(0).max(5000)
})

type FilterInput  = z.infer<typeof FilterSchema>

export default function Filter(props){
    const filter = useSelector((state : RootState)=> state.filter)
    const dispatch = useDispatch<AppDispatch>()
    
    console.log(filter)


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FilterInput>({
        resolver:zodResolver(FilterSchema),
        defaultValues:filter
    })

    return(
        <div style={{height:'100vh',width:'300px',zIndex:'2',position:'absolute',top:'0',left:'0',backgroundColor:'grey',textAlign:'start'}}>
            <p>Sort By:</p>
            <form onSubmit={handleSubmit((d)=>dispatch(setFilter(d)))}>
            <p>Review:</p>
                <input type="radio" id="r1"  value={1} {...register('review')}/>
                <label htmlFor="html">above 1 star</label><br/>
                <input type="radio" id="r2"  value={2} {...register('review')}/>
                <label htmlFor="css">above 2 star</label><br/>
                <input type="radio" id="r3"  value={3} {...register('review')}/>
                <label htmlFor="javascript">above 3 star</label><br/>
                <input type="radio" id="r4"  value={4} {...register('review')}/>
                <label htmlFor="javascript">above 4 star</label><br/>
                <input type="radio" id="r5"  value={4.5} {...register('review')}/>
                <label htmlFor="javascript">above 4.5 star</label><br/>
                {errors?.review?.message && <p>{errors.review.message}</p>}

            <p>Select Brands:</p>
                {props.brands.map(e=>
                    <label id={e} className="container">{e}
                    <input type="checkbox" value={e}  {...register('brands')} />
                    <span className="checkmark"></span>
                    </label>
                )}
                {errors?.brands?.message && <p>{errors.brands.message}</p>}
            <div>
                <p>By Price:</p>
                    <input type="text" {...register('price')} placeholder='Enter filter price'/><br />
                    {errors?.price?.message && <p>{errors.price.message}</p>}
                    <input type="radio" id="above" name="setvalue" value={1} {...register('type')}/>
                    <label htmlFor="above">Above amount set</label><br/>
                    <input type="radio" id="below" name="setvalue" value={0} {...register('type')}/>
                    <label htmlFor="below">Below amount set</label><br/>
                    {errors?.type?.message && <p>{errors.type.message}</p>}
                    <br />
            </div>


            <button type='submit'>Submit</button>
            </form>
        </div>
    )
}