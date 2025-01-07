import { AuthContextSchema, BookCreate, initBook, UserCreate } from "../schemas/schemas";

  export const handleAddBook = async (e: any, auth: AuthContextSchema, newBook: BookCreate, setNewBook: any, setBooks: any) => {
    e.preventDefault();
    if (auth.authLevel < 2) return;

    console.log("making book", newBook);
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/books/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
        body: JSON.stringify(newBook),
      });
      if (response.ok) {
        setNewBook(initBook);
        alert('Added new book!')
        fetchBooks(auth, setBooks);
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };
  


  export const fetchBooks = async (auth: AuthContextSchema, setBooks: any) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/books/getBooks', {
        headers: {'Authorization': `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const { data } = await response.json();
        console.log("data received: ", data)
        if(data) {
          setBooks(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };


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


export const handleBorrow = async (bookId: string, auth: AuthContextSchema, setBooks: any) => {
  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/transactions/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId }),
    });
    if (response.ok) {
      fetchBooks(auth, setBooks);
    }
  } catch (error) {
    console.error('Failed to borrow book:', error);
  }
};

