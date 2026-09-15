import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

type Book = {
  id: number;
  title: string;
  author: string;
};

type BookParams = {
  id: string;
};

let books: Book[] = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien" },
];

app.get("/books", (req: Request, res: Response): void => {
  res.json(books);
});

app.post("/books", (req: Request, res: Response) => {
  const newBook: Book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  res.json({ message: "Books added successfully", book: newBook });
});

app.put("/books/:id", (req: Request<BookParams>, res: Response): void => {
  const bookId: number = parseInt(req.params.id);
  const book = books.find((book) => book.id === bookId);
  if (!book) {
    res.status(404).json({ message: "book not found" });
    return;
  }
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  res.json({ message: "Book updated successfully", book });
});

app.delete("/books/:id", (req: Request<BookParams>, res: Response): void => {
  const bookId: number = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  res.json({ message: "Book deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
