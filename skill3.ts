// --- Skill 3: Interfaces ---

//Book Interface

interface Book {
  title: string;
  author: string;
  pages: number;
}

const book: Book = {
  title: "En man som heter Ove",
  author: "Fredrik Backman",
  pages: 352,
};

console.log(book.title);

// Nested & Optional Properties

interface Address {
  city: string;
  postalCode?: string;
}

interface Person {
  name: string;
  age: number;
  address: Address;
}

const persons: Person[] = [
  {
    name: "Johan Nilsson",
    age: 34,
    address: {
      city: "Ystad",
      postalCode: "27121",
    },
  },
  {
    name: "Johanna Nilsson",
    age: 36,
    address: {
      city: "Trelleborg",
    },
  },
];

console.log(persons[0].address.city);
console.log(persons[1].address.city);

// Challenge: Interface with a Typed Function

interface Movie {
  id: number;
  title: string;
  rating: Number;
  genres: string[];
}

const movies: Movie[] = [
  {
    id: 1,
    title: "The Odyssey",
    rating: 8.5,
    genres: ["Adventure", "Drama", "Fantasy"],
  },
  {
    id: 2,
    title: "28 Years Later: The Bone Temple",
    rating: 7.2,
    genres: ["Horror", "Thriller", "Drama"],
  },
  {
    id: 3,
    title: "Spider-Man: Brand New Day",
    rating: 8.0,
    genres: ["Action", "Adventure", "Sci-Fi"],
  },
  {
    id: 4,
    title: "The Sheep Detectives",
    rating: 7.4,
    genres: ["Animation", "Comedy", "Mystery"],
  },
];

const getMoviesByGenre = (movies: Movie[], genre: string): Movie[] => {
  return movies.filter((movie) => movie.genres.includes(genre));
};

const matchingMovies = getMoviesByGenre(movies, "Drama");

matchingMovies.forEach((movie) => {
  console.log(movie.title);
});
