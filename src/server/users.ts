import { AuthContextSchema, UserCreate } from "../schemas/schemas";

export const login = async (loginForm: {email: string; password: string}) => {
  return await fetch(import.meta.env.VITE_API_URL + '/api/v1/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginForm),
  });
}


export const handleRegister = async (e: any, auth: AuthContextSchema, registerForm: UserCreate) => {
  e.preventDefault();
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify(registerForm),
    });
    if (response.ok) {
      console.log("login now");
      alert('login now');
      location.reload();
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

