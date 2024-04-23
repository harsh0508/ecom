import * as React from 'react'
import './Header.css'
import { cartQuantity, fetchCart, getUserData } from '../../Providers/UserProvider.ts'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../Providers/ReduxStore/Store.ts'
import Cookies from 'universal-cookie'
import { logout, storeUser } from '../../Providers/ReduxStore/UserSlice.ts'
import { useNavigate } from 'react-router-dom'
import { getSearch } from '../../Providers/MainPageProvide.ts'
import { addText } from '../../Providers/ReduxStore/WebSlice.ts'

export default function Header(){
    const user = useSelector((state : RootState)=> state.user)
    const web = useSelector((state:RootState)=>state.web)
    const dispatch = useDispatch<AppDispatch>()
    const [sout , setsout] = React.useState(false)
    const navigate = useNavigate()
   
    React.useEffect(()=>{
        const fetch = async()=>{
            let userSend
           try {
            const cookie = new Cookies()
            const token = cookie.get('ac-token')
            dispatch(addText("Getting cookie from session storage"))
            if(token ===  undefined || null)
            {
                // state is sign out
                dispatch(addText("token is undefined/null no session logged"))
                userSend = user
                setsout(false)
            }
            else{
                // sign in and check
                dispatch(addText("Getting user Data"))
                const user = await getUserData(token)
                userSend = user
                if(user === undefined){
                    dispatch(addText(`User session is not available . Log in again`))
                    setsout(false)
                    return
                }
                console.log(user)
                setsout(true)
                dispatch(storeUser(user))
                dispatch(addText(`Adding user data to redux. userName ${user.name}`))
            }
           } catch (error) {
            console.log(error)
           }
           dispatch(addText("Fetching Cart data"))
           await fetchCart(userSend,dispatch)
        }

        fetch()
        
    },[dispatch])


    React.useEffect(()=>{
        const search  = document.getElementById('myInput') as HTMLInputElement
        search?.addEventListener('keydown',(e)=>{
            if(e.key === 'Enter'){
                if(search.value.length !== 0)
                    {   dispatch(addText(`Searching and displaying all product containing string ${search.value}`))
                        navigate(`products/str${search.value}`)}
            }
        })
    },[])


    const [suggestion,setSuggestion] = React.useState([])

    const searchUser = async(e)=>{
        if((e.length % 2) === 0 && e.length !== 0){
            dispatch(addText(`Searching database for products containing string ${e}`))
            setSuggestion(await getSearch(e))
        }
        if( e.length === 0 ){
            console.log('empty')
            setSuggestion([])
        }

    }
   
    



    return(
        <div style={{display:'flex',justifyContent:'space-around',height:'100px',alignItems:'center'}} className='header'>
            <h1 onClick={()=>navigate('/')}>{(user.name === '')?'Not Logged':user.name}</h1>
            
            <div style={{position:'absolute',top:'20%'}}>
                <input onChange={(e)=>searchUser(e.target.value)}  type="search" placeholder="Search..(Write and enter)" id="myInput" />
                <div className='search-suggestion'>
                    <div style={{backgroundColor:'wheat',width:'250px',textAlign:'start'}}>
                        {(suggestion.length === 0)?<></>:suggestion.map(e=><p onClick={()=>navigate(`pro/${e.id}`)}>{e.name}</p>)}
                    </div>
                </div>
            </div>
            {sout?<h4 onClick={()=>{dispatch(logout())}}>Logout</h4>:<></>}
            {sout?<></>:<h4 onClick={()=>{navigate('/login')}}>Login</h4>}
            <h4 onClick={()=>navigate('/cart')}>Cart{cartQuantity(user)}</h4>
        </div>
    )
}