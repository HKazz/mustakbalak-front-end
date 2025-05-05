import {useContext,useEffect} from 'react'
import { authContext } from '../context/AuthContext'
import axios from 'axios'

function Homepage() {
  // useContext(): allows me to consume the context

  // sending request to protected route that needs a token
  async function callProtectedRoute(){
    const token = localStorage.getItem("token")
    const response= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test-jwt/checkout`,{headers:{Authorization:`Bearer ${token}`}})
    console.log(response.data)
  }

  callProtectedRoute()
  return (
    <div>
      Homepage
    </div>
  )
}

export default Homepage
