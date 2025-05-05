import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router";

// 1. creating the context
const authContext = createContext()

function UserProvider(props){

    const [user,setUser] = useState(null)


    const navigate = useNavigate()
    async function validateToken(){
        // first get the token from localStorage
        const token = localStorage.getItem("token")

        if(token){
        // first condition if there is a valid token

            try{

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`,{headers:{Authorization:`Bearer ${token}`}})
                console.log(response.data)
                setUser(response.data)    
            }
            // second condition if the token is not valid
            catch(err){

                setUser(null)
                console.log(err)
            }
    
        }
        // third condition if there is no token in localstorage
        else{
            setUser(null)
        }
    }

    function logout(){

        localStorage.removeItem("token")
        validateToken()
        navigate("/login")
    }

    useEffect(()=>{
        validateToken()
    },[])


    const contextValues = {validateToken,user,logout}
    return(
        <authContext.Provider value={contextValues}>
            {props.children}
        </authContext.Provider>
    )
}


export {UserProvider, authContext}