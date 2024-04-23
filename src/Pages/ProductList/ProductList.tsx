import * as React from 'react'
import { useInView } from 'react-intersection-observer';
import Filter from '../../Component/Filter/Filter.tsx'
import { getProducts } from '../../Providers/MainPageProvide.ts'
import { useParams } from 'react-router-dom'
import ProductTile from '../../Component/ProductTile/ProductTile.tsx'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store.ts';
import { addText } from '../../Providers/ReduxStore/WebSlice.ts';


function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ProductList(){

    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
      });
    
    const [openFilter,setOpenFilter] = React.useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>()
    const [data,setData] = React.useState<any[]>([])
    const [pageNumber,setPageNumber] = React.useState<number>(1)
    const [brands,setBrand] = React.useState([])
    const [fx,setFx] = React.useState({brands:[],price:'',type:'',review:'-1'})
    let {id} = useParams()
    const filter  = useSelector((state: RootState)=>state.filter)


    

      React.useEffect(()=>{
        console.log("inView")
        if(inView ){
            if(pageNumber !== 0)
            setPageNumber(state=>
                state + 1)
        }
        dispatch(addText(`Returning page number : ${pageNumber}`))
      },[inView])


      React.useEffect(()=>{
        dispatch(addText(`Resetting page and applying filter , Sending filter Data.`))
        setPageNumber(-1)
        setData([])
      },[filter])

    React.useEffect(()=>{
        const getData = async()=>{
            dispatch(addText(`Fetching product id data for ${id}.`))
            // get data of products 
            if(pageNumber === 0) return
            if(pageNumber === -1) {setPageNumber(1) 
                return}
            const d = await getProducts(capitalizeFirstLetter(id!),pageNumber,filter)
            // get list of brands
            let bnew = d.map(e=>e['company'])
            bnew = brands.concat(bnew)
            // filter brands
            bnew = bnew.filter((e,i)=>bnew.indexOf(e) === i)
            setBrand(bnew)
            if(d.length < 9) setPageNumber(0)
            const newData = data.concat(d)
            setData(newData)
        }
        getData()
    },[id,pageNumber])

    return(
        <>
        {/* lazy load -- done 
            filter setup        
        */}
            <div >
                <button onClick={()=>setOpenFilter(!openFilter)} style={{position:'absolute',top:'0',left:'0',zIndex:'3'}}>Filter</button>
                {/* make it a button to dropout in either screen size */}
               { openFilter?<Filter brands={brands}/>:<></>}
                <div className='cards' style={{paddingBottom:'300px'}}>
                    {(data.length === 0 && data === undefined)?<></>:data.map((e:any)=><ProductTile product={e!}/>)}
                </div>
                {(data.length === 0 || pageNumber === 0)?<></>:<p ref={ref}>Loading...</p>}
            </div>
        </>
    )
}