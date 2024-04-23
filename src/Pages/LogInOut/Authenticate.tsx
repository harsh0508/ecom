import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as React from 'react'
import { login, signUp } from '../../Providers/UserProvider.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Providers/ReduxStore/Store.ts';
import { addText } from '../../Providers/ReduxStore/WebSlice.ts';

const FormSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string().min(6)
});

type FormInput = z.infer<typeof FormSchema>;

export default function Authenticate(props) {

    const [loginError,setError] = React.useState(false)
    const dispatch = useDispatch<AppDispatch>()

    const navigate   = useNavigate()
    const location = useLocation()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ""
        },
    });

    const sendToLog = async(data ,log:boolean)=>{
        console.log("checking logged")
       if(log){
        const logged = await login(data.username,data.password)
        if(logged){
            dispatch(addText(`Logged in . Redirecting to main page.`))
            navigate(`/`,{replace:false})
        }
        else{
            // set an error mechanism
            dispatch(addText(`Not able to log in. Some Error Occoured.`))
            setError(true)
        }
       }
       else{
        const sign = await signUp(data.username,data.password,data.email)
        if(sign){
            // successfull signup
            console.log("successful signup")
        }
        else{
            // unsucessfull signup
            console.log("unsucessfulls")
        }

       }
    }

    return (
        <div style={{height:'80vh',width:'auto',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {(location.state === undefined || location.state === null || location.state.Text === undefined)?"No text":location.state.Text}
            <form onSubmit={handleSubmit((d) => sendToLog(d,true))}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input id="username" {...register('username')} />
                    {errors?.username?.message && <p>{errors.username.message}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" {...register('email')} />
                    {errors?.email?.message && <p>{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="isAdmin">Password</label>
                    <input id="isAdmin" type="password" {...register('password')} />
                    {errors?.password?.message && <p>{errors.password.message}</p>}
                </div>

                <button type="submit">Submit</button>
            </form>
            {loginError?<p>Wrong ID or Password</p>:<></>}
            <p>or</p>
            <button onClick={handleSubmit((d) => sendToLog(d,false))}>Sign Up</button>
        </div>
    );
}
