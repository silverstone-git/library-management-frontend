import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BookOpen, Library, Users, BarChart3 } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', quantity: '' });

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (response.ok) {
        setIsLoggedIn(true);
        const data = await response.json();
        setIsAdmin(data.user.role === 'admin');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      if (response.ok) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/books/getBooks');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  // Add book handler (admin only)
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/v1/books/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (response.ok) {
        setNewBook({ title: '', author: '', isbn: '', quantity: '' });
        fetchBooks();
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  // Borrow book handler
  const handleBorrow = async (bookId) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/transactions/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      if (response.ok) {
        fetchBooks();
      }
    } catch (error) {
      console.error('Failed to borrow book:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {!isLoggedIn ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full"
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    style={{ backgroundColor: '#9c88bf', color: 'white' }}
                  >
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Register Form */}
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full"
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    style={{ backgroundColor: '#ffbddb', color: 'white' }}
                  >
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Tabs defaultValue="books" className="space-y-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Books
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Transactions
              </TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="books">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map((book) => (
                  <Card key={book.id}>
                    <CardHeader>
                      <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">Author: {book.author}</p>
                      <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                      <p className="text-sm text-gray-600 mb-4">Available: {book.quantity}</p>
                      <Button
                        onClick={() => handleBorrow(book.id)}
                        disabled={book.quantity === 0}
                        className="w-full"
                        style={{ backgroundColor: '#9c88bf', color: 'white' }}
                      >
                        Borrow
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Transactions list would go here */}
                </CardContent>
              </Card>
            </TabsContent>

            {isAdmin && (
              <>
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* User management interface would go here */}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admin Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddBook} className="space-y-4">
                        <Input
                          placeholder="Book Title"
                          value={newBook.title}
                          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        />
                        <Input
                          placeholder="Author"
                          value={newBook.author}
                          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        />
                        <Input
                          placeholder="ISBN"
                          value={newBook.isbn}
                          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={newBook.quantity}
                          onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })}
                        />
                        <Button 
                          type="submit"
                          style={{ backgroundColor: '#9c88bf', color: 'white' }}
                        >
                          Add Book
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default App;
