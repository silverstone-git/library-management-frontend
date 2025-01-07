import { handleBorrow } from "../server/books"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AuthContextSchema, BookPublic } from "../schemas/schemas"

const BookCard = (props: {book: BookPublic, auth: AuthContextSchema, setBooks: any}) => {

  return <Card key={props.book._id}>
    <CardHeader>
      <CardTitle>{props.book.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">{props.book.title} by {props.book.author} ({props.book.publicationYear})</p>
      <p className="text-sm text-gray-600">ID: {props.book._id}</p>
      <p className="text-sm text-gray-600 mb-4">Available: {props.book.availabilityStatus ? "Yes" : "No"}</p>
      <Button
        onClick={() => handleBorrow(props.book._id, props.auth, props.setBooks)}
        disabled={!props.book.availabilityStatus}
        className="w-full"
        style={{ backgroundColor: '#9c88bf', color: 'white' }}
      >
        Borrow
      </Button>
    </CardContent>
    </Card>
}

export default BookCard;
