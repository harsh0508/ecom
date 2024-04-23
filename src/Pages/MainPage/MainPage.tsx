import * as React from 'react'
import './MainPage.css'
import { Banner, RowData, getRowOne, getRowTwo, getSale } from '../../Providers/MainPageProvide.ts'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../Providers/ReduxStore/Store.ts'
import { addText } from '../../Providers/ReduxStore/WebSlice.ts'

export default function MainPage(){
    const navigate  = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [saleBanner , setSaleBanner] = React.useState<Banner >({
        date:'',
        goto:'',
        id:'',
        image:'',
        eventName:''
    })
    const [upperGrid, setUpperGrid ] = React.useState<RowData[]>([])
    const [lowerGrid , setLowerGrid ] = React.useState<RowData[] >([])

    const [loaded , setLoaded] = React.useState<boolean>(false)
    

    const getData = async()=>{
        dispatch(addText("Getting any special offer for today."))
        dispatch(addText("Getting All product categories"))
        dispatch(addText("Getting footer"))
        try{
            const [res1 , res2, res3] = await Promise.all([
                await getSale(),
                await getRowOne(),
                await getRowTwo()
            ])

            setSaleBanner(res1)
            setUpperGrid(res2)
            setLowerGrid(res3)
            setLoaded(true)
        }
        catch(e){
            // Send error report
        }

    }

    React.useEffect(()=>{
      getData()
    },[])

    return(
        !loaded?
        <div style={{height:'90vh',width:'auto',display:'flex',alignItems:'center',justifyContent:'center'}}><span className="loader"></span></div>
        :<>
           {/* main body */}
            <h4>SALES BANNER</h4>
            <div className='saleBanner' onClick={()=>{
                // send to the page needed with offer items
            }}>
                <p>{saleBanner.eventName}</p>
                <img src={saleBanner.image} alt=''/>
            </div>
            <h4>PRODUCT CATEGORIES</h4>
            <div className='cards'>
                {upperGrid.map((e)=>
                    <div
                    style={{
                        backgroundImage:`url(${e.image})`
                    }}
                    
                    className='card' key={e.id} onClick={()=>{
                        // send to the goto link
                       navigate(`products/${e.head}`,{replace:false})
                    }}>
                        <p>{e.head}</p>
                    </div>
                    )}
            </div>
            <h4>FOOTER</h4>
            <div>
                {lowerGrid.map((e)=>
                    <div key={e.id} onClick={()=>{
                        // send to the goto link
                    }}>
                          <img src={e.image} alt="" />
                    </div>
                    )}
            </div>
        </>
    )
}