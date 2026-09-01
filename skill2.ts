// ---Skill 2: Interfaces & Type Aliases (& means AND)

//Book Interface
interface Book {
  title: string;
  pages: number;
}

const book: Book = {
  title: "Dune",
  pages: 412,
};

const describeBook = (book: Book): string => {
  const message = `The book ${book.title} has ${book.pages} pages.`;
  console.log(message);
  return message;
};

describeBook(book);

//Combining Interfaces
interface Teacher {
  name: string;
  subject: string;
}

interface Employee {
  id: number;
  email: string;
}

type SchoolTeacher = Teacher & Employee;

const teacher: SchoolTeacher = {
  name: "Michiel van der Gragt",
  subject: "Backend Development",
  id: 1,
  email: "michiel.vandergragt@sundsgarden.se",
};

const printTeacherInfo = (teacher: SchoolTeacher): void => {
  console.log(
    `${teacher.name} with teacherID:${teacher.id} teaches ${teacher.subject}. You can email the teacher at ${teacher.email}`,
  );
};

printTeacherInfo(teacher);

// Callenge (optional) Favorite Car

interface Car {
  brand: string;
  year: number;
}

const car = {
  brand: "Toyota",
  year: 2022,
};

const printCar = (car: Car): string => {
  const message = `Brand: ${car.brand}, Year: ${car.year}`;
  return message;
};

console.log(printCar(car));
