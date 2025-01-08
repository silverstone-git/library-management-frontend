import { deleteBook, handleBorrow } from "../server/books"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AuthContextSchema, BookPublic } from "../schemas/schemas"
import { Trash } from "lucide-react"

const BookCard = (props: {book: BookPublic, auth: AuthContextSchema, books: BookPublic[], setBooks: any}) => {

  return <Card key={props.book._id}>
    <CardHeader>
      <CardTitle>{props.book.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{props.book.title} by {props.book.author} ({props.book.publicationYear})</p>
      <p className="text-sm text-gray-600">ID: {props.book._id}</p>
      <p className="text-sm text-gray-600 mb-4">Available: {props.book.availabilityStatus ? "Yes" : "No"}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => handleBorrow(props.book._id, props.auth, props.setBooks)}
            disabled={!props.book.availabilityStatus}
            className="w-full"
            style={{ backgroundColor: '#9c88bf', color: 'white' }}
          >
            Borrow
          </Button>

          {props.auth.authLevel == 2 ? 
            <div 
              className="w-3/12 flex items-center justify-center bg-red-500 rounded cursor-pointer" 
              onClick={() => {
                deleteBook(props.book, props.auth, props.books, props.setBooks)}
              } > 
                <Trash /> 

              </div> 
            : null}

        </div>
    </CardContent>
    </Card>
}

export default BookCard;
