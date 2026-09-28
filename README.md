# SQL Basics Homework: Docker, pgAdmin & PostgreSQL

### Practice Based on Class Code

In class we learned what containers are, how Docker uses a `compose.yml` file to build and run them, and how to spin up a **PostgreSQL** database together with **pgAdmin** so we can write SQL queries in the browser. We also added volumes so our data survives a restart, and moved our settings into a `.env` file.

This week you'll use that same setup to load a real practice database and work through the **Basic** exercises on [PostgreSQL Exercises](https://pgexercises.com/).

## Goal

Get comfortable running Postgres and pgAdmin in Docker, and practice writing basic SQL queries: `SELECT`, `WHERE`, `LIKE`, `IN`, `CASE`, `ORDER BY`, `DISTINCT`, `UNION` and simple aggregates like `MAX` and `COUNT`.

**Videos:**

- Part 1 (Containers, Docker, Postgres & pgAdmin): https://youtu.be/9DIF5Ma--bQ
- Part 2 (Volumes, depends_on & .env): https://www.youtube.com/watch?v=Pvz0CEqnSj0

## Project Outline

```
week7-sqlbasics/
  ├── compose.yml   : your Postgres + pgAdmin containers
  ├── .env          : your environment variables
  └── cd.sql        : your answers to the exercises
```

## Resources

- Useful Websites:
  - https://pgexercises.com/
  - https://pgexercises.com/gettingstarted.html
  - https://hub.docker.com/_/postgres
  - https://hub.docker.com/r/dpage/pgadmin4
  - https://www.w3schools.com/postgresql/
  - https://www.postgresql.org/docs/current/

### Key Concepts

```bash
docker compose up -d        # start the containers (detached, so you keep your terminal)
docker compose down         # stop and remove the containers (data stays in the volumes!)
docker container ls         # list running containers
docker inspect <id>         # find the IP address of a container
```

```sql
SELECT col1, col2 FROM table;           -- choose which columns you get back
WHERE condition                         -- choose which rows you get back
LIKE '%text%'                           -- basic string search
IN (1, 5)                               -- match against several values
CASE WHEN ... THEN ... ELSE ... END     -- put results into buckets
ORDER BY col DESC LIMIT 10              -- sort and limit your results
DISTINCT                                -- remove duplicates
UNION                                   -- combine results from two queries
MAX(col), COUNT(*)                      -- simple aggregation
```

## Skill 1: Docker Setup

Create a `compose.yml` with two services, just like in the videos:

- A **Postgres** container using the official `postgres` image
- A **pgAdmin** container using the `dpage/pgadmin4` image, which `depends_on` the database

Make sure you have:

- Volumes for both containers so your data is saved when you shut them down
- Your usernames, passwords, database name and ports in a `.env` file
- `restart: always` on both services

Run `docker compose up -d` and check with `docker container ls` that both containers are running.

## Skill 2: Connect pgAdmin to Postgres

Go to `http://localhost:8080` and log in with the pgAdmin email and password from your `.env` file.

Add a new server:

- Find the IP address of your Postgres container with `docker inspect`
- Use port **5432** (the port _inside_ the container, not the one on your laptop!)
- Use the Postgres username and password from your `.env` file

## Skill 3: Load the Country Club Data

The exercises use a dataset for a country club, with three tables in a schema called `cd`: `members`, `facilities` and `bookings`. Read the [Getting Started](https://pgexercises.com/gettingstarted.html) page to get to know the tables.

1. Download the SQL file: https://pgexercises.com/dbfiles/clubdata.sql
2. Open the **Query Tool** in pgAdmin on your database
3. Copy the code from the file into the Query Tool and run it

**Tip:** The top of the file is written for the `psql` command-line tool. If you get an error on lines that create a new database or start with a backslash (like `\c exercises`), delete those lines and start from `CREATE SCHEMA cd;`. The tables will then be created in your own database.

Check that it worked:

```sql
SELECT * FROM cd.facilities;
```

You should see a list of facilities such as tennis courts, a squash court and a snooker table.

## Skill 4: The Basic Exercises

Work through **all the exercises** in the [Basic section](https://pgexercises.com/questions/basic/):

1. Retrieve everything from a table
2. Retrieve specific columns from a table
3. Control which rows are retrieved
4. Control which rows are retrieved – part 2
5. Basic string searches
6. Matching against multiple possible values
7. Classify results into buckets
8. Working with dates
9. Removing duplicates, and ordering results
10. Combining results from multiple queries
11. Simple aggregation
12. More aggregation

Write each query in pgAdmin first and make sure it returns the correct result. Then copy it into `cd.sql`, with a comment above each one, like this:

```sql
-- 1. Retrieve everything from a table
SELECT * FROM cd.facilities;

-- 2. Retrieve specific columns from a table
SELECT name, membercost FROM cd.facilities;
```

**Try it yourself first!** Every exercise on the site has a hint and an answer. Use the hint if you're stuck, but only look at the answer once you've tried. When you check the answer, read the explanation too; that's where the learning happens.

**Note:** Your results may come back in a slightly different order than on the website. That's okay, as long as the rows are the same (unless the exercise asks you to sort them).

## When You Finish

Make sure `cd.sql` runs from top to bottom in pgAdmin without errors.

Push your project to your GitHub repository on the following branch: `week7/sqlbasics`

Your submission should include `compose.yml` and `cd.sql`. Add your `.env` file to `.gitignore` so your passwords don't end up on GitHub. Good practice, even if the password is just `root`!

Good luck, and remember: every app you've built so far had data that disappeared when you restarted the server. From now on, your data lives in a real database!
