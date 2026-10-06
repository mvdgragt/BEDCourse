-- Skill 1: Rebuild the Relationships from the Video

-- Start fresh so the file can be run again without "already exists" errors.
-- Child tables (the ones with foreign keys) are dropped first.
DROP TABLE IF EXISTS student_courses, students, courses, books, authors, profiles, users;


-- 1. One-to-one

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE,
  bio TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, email) VALUES ('Michiel', 'michiel.vandergragt@sundsgarden.se');
INSERT INTO profiles (user_id, bio) VALUES (1, 'Loves Coding!');

SELECT * FROM users;
SELECT * FROM profiles;

SELECT users.name, profiles.bio
FROM users
JOIN profiles ON users.id = profiles.user_id;


-- 2. One-to-many

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO authors (name) VALUES ('J.K.Rowling');

INSERT INTO books (title, author_id) VALUES ('Harry Potter', 1);
INSERT INTO books (title, author_id) VALUES ('Fantastic Beasts', 1);

SELECT authors.name, books.title
FROM authors
JOIN books ON authors.id = books.author_id;

-- 3. Many-to-many

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100)
);

CREATE TABLE student_courses (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

INSERT INTO students (name) VALUES ('Tom'), ('Sara');
INSERT INTO courses (title) VALUES ('Maths'), ('Science');
INSERT INTO student_courses (student_id, course_id) VALUES (1, 1), (1, 2), (2, 1);

SELECT students.name, courses.title
FROM students
JOIN student_courses ON students.id = student_courses.student_id
JOIN courses ON courses.id = student_courses.course_id;

-- Trying to break it, to make sure the queries are solid!

-- Test 1: a book with an author that doesn't exist
-- INSERT INTO books (title, author_id) VALUES ('Backend Book', 56);

-- Error:
-- ERROR:  insert or update on table "books" violates foreign key constraint "books_author_id_fkey"
-- Key (author_id)=(56) is not present in table "authors".

-- Why:
-- books.author_id is a foreign key, so it must point to an id that exists in the authors table.
-- There is no author with id = 56, so PostgreSQL rejects the insert.

-- Test 2: the same student in the same course twice
-- INSERT INTO student_courses (student_id, course_id) VALUES (1, 1);

-- Error:
-- ERROR:  duplicate key value violates unique constraint "student_courses_pkey"
-- Key (student_id, course_id)=(1, 1) already exists.

-- Why:
-- (student_id, course_id) is a composite primary key, so each combination can only appear once.
-- Mark is already in the SQL course, so adding him again is rejected.