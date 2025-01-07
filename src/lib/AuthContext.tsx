import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Create a context
const AuthContext = createContext<{authLevel: number; token: string; user: {name: string; email: string; role: string}; loginAction: any; logOut: any}>({
  authLevel: 0, 
  token: "", 
  user: {name: "", email: "", role: ""},
  loginAction: null,
  logOut: null
});

// Create a provider component
export const AuthProvider = ({ children }: any) => {
    const [authLevel, setAuthLevel] = useState<number>(0);
    const [token, setToken] = useState(Cookies.get('token') || "")
    const [user, setUser] = useState<{name: string; email: string; role: string}>(
    {
      name: Cookies.get('name') || "", 
      email: Cookies.get('email') || "", 
      role: ""})

    const checkLoggedIn = (user: any, setAuthLevel: any, setUser: any) => {

        const token = Cookies.get('token');
        if(token) {
          const decoded: any = jwtDecode(token ?? '');
          if(decoded['role'] == 'admin') {
            console.log("admin");
            setAuthLevel(2);
            setUser({...user, role: "admin"})
          } else {
            console.log(decoded);
            setAuthLevel(1);
            setUser({...user, role: "user"})
          }
        } else {
          setAuthLevel(0);
        }
    }


    useEffect(() => {
        // Check if the token exists in cookies
        checkLoggedIn(user, setAuthLevel, setUser);
    }, []);

    const loginAction = async (loginForm: any) => {
      // logs in, gets the token etc
      //
    //
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        });
        if (response.ok) {
          const data = await response.json();
          Cookies.set('token', data.token, { expires: 7 });
          Cookies.set('name', data.name, { expires: 7 });
          Cookies.set('email', data.email, { expires: 7 });
          setUser({name: data.name as string, email: data.email as string, role: ""})
          setToken(token)
          checkLoggedIn(user, setAuthLevel, setUser);
          
        }
      } catch (error) {
        console.error('Login failed:', error);
      }

    }

    const logOut = () => {
      setUser({name: "", email: "", role: ""});
      setToken("");
      Cookies.remove('token');
      Cookies.remove('name');
      Cookies.remove('email');
      Cookies.remove('role');
      location.reload();
    };

    return (
        <AuthContext.Provider value={{ 
      authLevel, 
      token, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to use the AuthContext

export default AuthProvider;
export const useAuth = () => {
    return useContext(AuthContext);
};
