import { AuthContextSchema, BookCreate, BookPublic, initBook } from "../schemas/schemas";

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
  

export const deleteBook = async (book: BookPublic, auth: AuthContextSchema, books: BookPublic[], setBooks: any) => {
  // delete a book from the backend and also rellext in frontend
  //
  
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/books/' + book._id, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const { data } = await response.json();
        console.log("book deleted!", data)
        const booksNew = books.filter(item => item._id !== book._id);
        setBooks(booksNew)
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
}


  export const fetchBooks = async (auth: AuthContextSchema, setBooks: any) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/books/getBooks', {
        headers: {'Authorization': `Bearer ${auth.token}` },
      });
      if (response.ok) {
        const { data } = await response.json();
        if(data) {
          setBooks(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

export const handleBorrow = async (bookId: string, auth: AuthContextSchema, setBooks: any) => {

  const currentDate = new Date();

  const daysToAdd = Number(import.meta.env.VITE_DEFAULT_BORROW_LIMIT ?? "7");

  const futureDate = new Date(currentDate);

  futureDate.setDate(currentDate.getDate() + daysToAdd)

  console.log("userId sending: ", auth.user._id)

  try {
    const response = await fetch(import.meta.env.VITE_API_URL + '/api/v1/transactions/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ bookId, userId: auth.user._id, returnDate: futureDate }),
    });
    if (response.ok) {
      fetchBooks(auth, setBooks);
    }
  } catch (error) {
    console.error('Failed to borrow book:', error);
  }
};

