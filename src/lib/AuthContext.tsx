import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { AuthContextSchema } from '../schemas/schemas';
import { login } from '../server/users'

// Create a context
const AuthContext = createContext<AuthContextSchema>({
  authLevel: 0, 
  token: "", 
  user: {_id: "", name: "", email: "", role: ""},
  loginAction: null,
  logOut: null
});

// Create a provider component
export const AuthProvider = ({ children }: any) => {
    const [authLevel, setAuthLevel] = useState<number>(0);
    const [token, setToken] = useState(Cookies.get('token') || "")
    const [user, setUser] = useState<{_id: string; name: string; email: string; role: string}>(
    {
      _id: Cookies.get('_id') || "",
      name: Cookies.get('name') || "", 
      email: Cookies.get('email') || "", 
      role: ""})

    const logOut = () => {
      setUser({_id: "",name: "", email: "", role: ""});
      setToken("");
      setAuthLevel(0);
      Cookies.remove('token');
      Cookies.remove('name');
      Cookies.remove('email');
      Cookies.remove('role');
      Cookies.remove('_id');
      //location.reload();
    };


    const checkLoggedIn = (user: any, setAuthLevel: any, setUser: any) => {

        const token = Cookies.get('token');
        if(token) {
          
          try {
            const decoded: any = jwtDecode(token ?? '');
            setUser({...user, _id: decoded['id']}) 

            if(decoded['role'] == 'admin') {
              setAuthLevel(2);
              setUser({...user, role: "admin"})
            } else {
              setAuthLevel(1);
              setUser({...user, role: "user"})
            }
          } catch(e) {

            console.log("Cookie reading and state setting failed: ", e);
            logOut();
          }

        } else {
          logOut();
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
        const response = await login(loginForm);

        if (response.ok) {
          const data = await response.json();
          Cookies.set('token', data.token, { expires: 7 });
          Cookies.set('name', data.name, { expires: 7 });
          Cookies.set('email', data.email, { expires: 7 });
          Cookies.set('_id', data._id, { expires: 7 });
          setUser({_id: data._id as string, name: data.name as string, email: data.email as string, role: ""})
          setToken(token)
          checkLoggedIn(user, setAuthLevel, setUser);
          location.reload();
          
        }
      } catch (error) {
        console.error('Login failed:', error);
      }

    }

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
