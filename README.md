# SQL Joins Homework: Relationships, JOINs & Subqueries

### Practice Based on Class Code

In the last lesson we set up **PostgreSQL** and **pgAdmin** in Docker, loaded the country club database and practiced basic SQL queries on a single table.

In this lesson we learned how tables can be **related** to each other: **one-to-one** (a user and their profile), **one-to-many** (an author and their books) and **many-to-many** (students and courses, connected with a **junction table**). We used **foreign keys** to link tables, a **composite primary key** to stop duplicates, and **JOIN** to combine data from several tables in one query.

This week you'll use the same Docker setup and the same country club data to work through the **Joins and Subqueries** exercises on [PostgreSQL Exercises](https://pgexercises.com/).

## Goal

Understand how tables are connected with primary and foreign keys, and practice combining data from several tables with `JOIN`, `LEFT OUTER JOIN`, self-joins and subqueries.

**Videos:**

- Part 1 (Containers, Docker, Postgres & pgAdmin): https://youtu.be/9DIF5Ma--bQ
- Part 2 (Volumes, depends_on & .env): https://www.youtube.com/watch?v=Pvz0CEqnSj0
- Part 3 (Relationships, JOINs, GROUP BY & ORDER BY): https://www.youtube.com/watch?v=7NJmsSNPKi8

## Project Outline

```
week7/sqljoins
  ├── compose.yml      : your Postgres + pgAdmin containers (from last week)
  ├── .env             : your environment variables
  ├── relationships.sql: your tables from the video
  └── joins.sql        : your answers to the exercises
```

## Resources

- Useful Websites:
  - https://pgexercises.com/questions/joins/
  - https://pgexercises.com/gettingstarted.html
  - https://www.w3schools.com/postgresql/postgresql_joins.php
  - https://www.postgresql.org/docs/current/tutorial-join.html
  - https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK

### Key Concepts

```sql
-- Relationships
PRIMARY KEY                                  -- uniquely identifies each row
FOREIGN KEY (author_id) REFERENCES authors(id)  -- links a column to another table
PRIMARY KEY (student_id, course_id)          -- composite primary key (junction tables)

-- Joins
SELECT a.name, b.title
FROM authors a                               -- "a" is an alias (a short name for the table)
JOIN books b ON a.id = b.author_id;          -- INNER JOIN: only rows that match in both tables

SELECT m.firstname, r.firstname
FROM cd.members m
LEFT OUTER JOIN cd.members r                 -- LEFT JOIN: keep ALL rows from the left table,
  ON r.memid = m.recommendedby;              -- even if there is no match (you get NULL instead)

-- A self-join is when a table is joined to itself.
-- You MUST use two different aliases (like m and r above) so Postgres knows which copy you mean.

-- Subqueries: a query inside another query
SELECT name FROM cd.facilities
WHERE facid IN (SELECT facid FROM cd.bookings);
```

## Skill 1: Rebuild the Relationships from the Video

Make sure Docker is running, then start your containers from last week:

```bash
docker compose up -d
```

Open pgAdmin on `http://localhost:8080` and open the Query Tool. Recreate the three examples from the video and save the code in `relationships.sql`:

1. **One-to-one:** a `users` table and a `profiles` table, where `profiles.user_id` is `UNIQUE` and a foreign key to `users.id`
2. **One-to-many:** an `authors` table and a `books` table, where `books.author_id` is a foreign key to `authors.id`
3. **Many-to-many:** a `students` table, a `courses` table and a `student_courses` junction table with a composite primary key

For each one, insert a few rows and write a `SELECT` with a `JOIN` that shows the connected data (for example, every student with the courses they take).

**Try to break it!** Insert a book with an `author_id` that doesn't exist, or add the same student to the same course twice. What error do you get, and why? Write your answer as a comment in `relationships.sql`.

## Skill 2: Map the Country Club Relationships

Before you start the exercises, look at the three tables in the `cd` schema again: `members`, `facilities` and `bookings`. Read the [Getting Started](https://pgexercises.com/gettingstarted.html) page and look at the diagram.

Answer these questions as comments at the top of `joins.sql`:

- Which columns in `cd.bookings` are foreign keys, and which tables do they point to?
- What kind of relationship is there between `members` and `facilities`? Which table plays the role of the junction table, like `student_courses` in the video?
- The `recommendedby` column in `cd.members` points back to `cd.members` itself. What kind of relationship is that?

**Tip:** If your containers were removed but your volume is still there, the country club data should still be in your database. Check with `SELECT * FROM cd.members;`. If it's gone, load `clubdata.sql` again like last week.

## Skill 3: The Joins and Subqueries Exercises

Work through **all the exercises** in the [Joins and Subqueries section](https://pgexercises.com/questions/joins/):

1. Retrieve the start times of members' bookings
2. Work out the start times of bookings for tennis courts
3. Produce a list of all members who have recommended another member
4. Produce a list of all members, along with their recommender
5. Produce a list of all members who have used a tennis court
6. Produce a list of costly bookings
7. Produce a list of all members, along with their recommender, using no joins
8. Produce a list of costly bookings, using a subquery

Write each query in pgAdmin first and make sure it returns the correct result. Then copy it into `joins.sql`, with a comment above each one, like this:

```sql
-- 1. Retrieve the start times of members' bookings
SELECT bks.starttime
FROM cd.bookings bks
JOIN cd.members mems ON mems.memid = bks.memid
WHERE mems.firstname = 'David' AND mems.surname = 'Farrell';
```

**Hints for the tricky ones:**

- **3 and 4** are self-joins. Think of it as having two copies of the `members` table: one for the member and one for the person who recommended them.
- **4** asks for _all_ members, including the ones nobody recommended. Which kind of join keeps rows that have no match?
- **5 and 6** join three tables, just like students → student_courses → courses in the video.
- **6** needs the `CASE` you used last week: guests (`memid = 0`) pay a different price than members.
- **7 and 8** are the hardest. They use subqueries instead of (or together with) joins. Don't worry if you need the hint here!

**Try it yourself first!** Every exercise on the site has a hint and an answer. Use the hint if you're stuck, but only look at the answer once you've tried. When you check the answer, read the explanation too; that's where the learning happens.

**Note:** Your results may come back in a slightly different order than on the website. That's okay, as long as the rows are the same (unless the exercise asks you to sort them).

## When You Finish

Make sure `relationships.sql` and `joins.sql` both run from top to bottom in pgAdmin without errors.

Push your project to your GitHub repository on the following branch: `week7/sqljoins`

Your submission should include `compose.yml`, `relationships.sql` and `joins.sql`. Keep your `.env` file in `.gitignore` so your passwords don't end up on GitHub.

Good luck, and remember: real apps almost never keep all their data in one table. Once you can join tables together, you can answer almost any question your data can answer!
