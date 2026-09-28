-- 1. Retrieve everything from a table
SELECT * FROM cd.facilities; 

-- 2. Retrieve specific columns from a table
SELECT name, membercost FROM cd.facilities;

-- 3. Control which rows are retrieved
SELECT * FROM cd.facilities WHERE membercost > 0;

-- 4. Control which rows are retrieved – part 2
SELECT facid, name, membercost, monthlymaintenance FROM cd. facilities WHERE membercost >0 AND (membercost < monthlymaintenanance/50.0)

-- 5. Basic string searches
SELECT * FROM cd. facilities WHERE name LIKE '%Tennis%';

-- 6. Matching against multiple possible 
SELECT * FROM cd.facilities WHERE facid = 1 OR facid = 5;
SELECT * FROM cd.facilities WHERE facid in (1,5); --better option

-- 7. Classify results into buckets
SELECT
    name,
    monthlymaintenance AS cost,
    CASE
        WHEN monthlymaintenance > 100 THEN 'expensive'
        ELSE 'cheap'
    END AS cost
FROM cd.facilities;


-- 8. Working with dates
SELECT memid, surname, firstname, joindate FROM cd.members WHERE joindate >= '%2012-09-01%'

-- 9. Removing duplicates, and ordering results
SELECT DISTINCT surname from cd.members ORDER BY surname ASC FETCH FIRST 10 ROWS ONLY 

select distinct surname 
	from cd.members
order by surname
limit 10;  

-- 10. Combining results from multiple queries
SELECT surname from cd.members UNION SELECT name FROM cd.facilities;

-- 11. Simple aggregation
SELECT joindate as latest from cd.members ORDER BY joindate DESC limit 1 ; --this give me the actual row
select max(joindate) as latest from cd.members; --this give an aggregate value
	 

-- 12. More aggregation
SELECT firstname, surname, joindate FROM cd.members ORDER BY joindate DESC limit 1;  --this give me the actual row
select firstname, surname, joindate from cd.members where joindate = (select max(joindate)  from cd.members); --this give an aggregate value
	        