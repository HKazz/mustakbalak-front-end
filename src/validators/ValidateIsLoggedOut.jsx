import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router'

function ValidateIsLoggedOut(props) {
    const { user } = useAuth()

    if(!user){
        return props.children
    }
    else{
        return <Navigate to="/"/>
    }
}

export default ValidateIsLoggedOut
