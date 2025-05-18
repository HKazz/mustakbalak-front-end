import {useEffect} from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Homepage() {
  const { user } = useAuth();

  // sending request to protected route that needs a token
  async function callProtectedRoute(){
    const token = localStorage.getItem("token")
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/test-jwt/checkout`,{headers:{Authorization:`Bearer ${token}`}})
    console.log(response.data)
  }

  useEffect(() => {
    callProtectedRoute()
  }, [])

  return (
    <div>
      Homepage
    </div>
  )
}

export default Homepage
