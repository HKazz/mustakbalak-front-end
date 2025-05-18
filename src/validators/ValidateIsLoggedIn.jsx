import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'

function ValidateIsLoggedIn(props) {
    const { user } = useAuth()

    if(user){
        return props.children
    }
    else{
        return <Navigate to="/login"/>
    }
}

export default ValidateIsLoggedIn
