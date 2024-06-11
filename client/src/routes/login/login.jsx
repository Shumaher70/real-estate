import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './login.scss';
import apiRequest from '../../lib/apiRequest';

function Login() {
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      setError('');
      setIsLoading(true);
      e.preventDefault();
      const formData = new FormData(e.target);

      const username = formData.get('username');
      const password = formData.get('password');

      try {
         const res = await apiRequest.post('/auth/login', {
            username,
            password,
         });

         localStorage.setItem('user', JSON.stringify(res.data));

         navigate('/');
      } catch (error) {
         setError(error.response.data.message);
      } finally {
         setIsLoading(false);
      }
   };
   return (
      <div className="login">
         <div className="formContainer">
            <form onSubmit={handleSubmit}>
               <h1>Welcome back</h1>
               <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  minLength={3}
                  maxLength={20}
               />
               <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
               />
               {error && <span>{error}</span>}
               <button disabled={isLoading}>Login</button>
               <Link to="/register">{"Don't"} you have an account?</Link>
            </form>
         </div>
         <div className="imgContainer">
            <img src="/bg.png" alt="" />
         </div>
      </div>
   );
}

export default Login;
