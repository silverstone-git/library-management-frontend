import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import Cookies from 'js-cookie';
import { AuthProvider } from './lib/AuthContext';

const isLoggedIn = () => {
    return Cookies.get('token') !== undefined;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Navbar />
      <App />
    </AuthProvider>
  </StrictMode>,
)
