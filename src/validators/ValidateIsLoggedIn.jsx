import {useContext} from 'react'
import { authContext } from '../context/AuthContext'
import { Navigate } from 'react-router'

function ValidateIsLoggedIn(props) {
    const {user} = useContext(authContext)

    if(user){
        return( props.children)
    }
    else{
        return(<Navigate to="/login"/>)
    }
}

export default ValidateIsLoggedIn
