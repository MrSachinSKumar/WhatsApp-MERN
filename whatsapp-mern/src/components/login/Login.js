import { Button } from '@mui/material'
import React from 'react'
import './Login.css'
//import {auth, provider} from '../config/firebase/firebase'
import {auth,provider} from '../config/firebase/firebase'

import { actionTypes } from '../config/firebase/reducer'
import { useStateValue } from '../config/firebase/StateProvider'
import {Dispatch} from 'redux'

function Login() 
{
    //const {user} = useContext(AuthContext)
    //const [dispatch]=useStateValue()
    const [{},dispatch] = useStateValue()
    const signIn=()=>
    {
        auth.signInWithPopup(provider).then((result)=>{
            console.log(result);
            console.log(result.user);
            dispatch({
                   type: actionTypes.SET_USER,
                   user: result.user
               })
            
        }).catch((error)=>{alert(error.message)})
    }

  return (
    <div className='login'>
        <div className="login_container">
            <img src="https://www.freepnglogos.com/uploads/whatsapp-logo-light-green-png-0.png" alt="" />
            <div className="login_text">
                <h1>Sign in</h1>
            </div>
            <Button type='submit' onClick={signIn}>Sign in with google</Button>
        </div>
    </div>
  )
}

export default Login

//<Button type='submit' onClick={signIn}>