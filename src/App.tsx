import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BookOpen, Library, Users, BarChart3 } from 'lucide-react';
import { BookPublic, initBook, AuthContextSchema, UserCreate } from './schemas/schemas';
import { useAuth } from './lib/AuthContext';
import { Checkbox } from './components/ui/checkbox';
import BookCard from './components/BookCard';
import { fetchBooks, handleAddBook, handleRegister } from './server/books';

const App = () => {

  //const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState<BookPublic[]>([]);
  //const [transactions, setTransactions] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<UserCreate>({name: '', email: '', password: ''});
  const [newBook, setNewBook] = useState(initBook);

  const auth: AuthContextSchema = useAuth();

  console.log(auth);

  useEffect(() => {

    // get the books:
    //
    fetchBooks(auth, setBooks);
  }, [])

  const handleLogin = async (e: any, auth: AuthContextSchema) => {
    e.preventDefault();
    auth.loginAction(loginForm)
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {auth.authLevel == 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleLogin(e, auth)} className="space-y-4">
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
                <form onSubmit={(e) => handleRegister(e, auth, registerForm)} className="space-y-4">
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
              {auth.authLevel == 2 && (
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

                {books.map((book: BookPublic) => (
                    <BookCard key={book._id} book={book} auth={auth} setBooks={setBooks} />
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

            {auth.authLevel == 2 && (
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
                      <form onSubmit={(e) => handleAddBook(e, auth, newBook, setNewBook, setBooks)} className="space-y-4">
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
                          placeholder="Publication Year"
                          type='number'
                          value={newBook.publicationYear}
                          onChange={(e) => setNewBook({ ...newBook, publicationYear: Number(e.target.value) })}
                        />
                        <Input
                          placeholder="ISBN"
                          value={newBook.isbn}
                          onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                        />
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            id='availabilityStatus'
                            value={newBook.availabilityStatus ? 'on' : 'off'}
                            onCheckedChange={(e) => {
                                setNewBook({ ...newBook,
                                availabilityStatus: e.valueOf() == true })
                                }
                              }
                          />
                          <Label htmlFor='availabilityStatus'>
                            Book is available
                          </Label>

                        </div>
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
