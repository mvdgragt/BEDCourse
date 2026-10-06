-- Skill 2: Map the Country Club Relationships

/*
Which columns in cd.bookings are foreign keys, and which tables do they point to?
- facid points to the facilities table
- memid points to the members table
*/

/*
What kind of relationship is there between members and facilities? Which table place the role of the junction table, like student_courses in the video?
- The relationship between members and facilities is that many members can choose of many facilities and many facilities can have many members so there is a many-to-many relationship.
- The table that plays a role of the junction table is the booking table where members can book facilities.
*/

/*
The recommended by column in CD of members points back to CD members itself. What kind of relationship is that?
- This is called a self–referencing relationship also called recursive and it's I want to many. 
- One member can recommend many other members.
- Each member was recommended by at most one member, or none, since recommendedby is allowed to be NULL
*/

-- skill three: the joints and subqueries exercises

-- 1. Retrieve the start times of members bookings.
SELECT starttime FROM cd.bookings  JOIN cd.members ON cd.members.memid = cd.bookings.memid
WHERE cd.members.firstname = 'David' AND cd.members.surname = 'Farrell'

-- 2. Work out the start times of bookings for tennis courts.
SELECT starttime as start, name  FROM cd.facilities JOIN cd.bookings ON cd.facilities.facid = cd.bookings.facid
WHERE starttime >= '2012-09-21' AND starttime < '2012-09-22' AND facilities.name ILIKE 'tennis%'
ORDER BY starttime

-- 3. Produce a list of all members who have recommended another member
SELECT DISTINCT rec.firstname, rec.surname
FROM cd.members mem
INNER JOIN cd.members rec
ON rec.memid = mem.recommendedby
ORDER BY surname, firstname;          

-- 4. Produce a list of all members, along with their recommended.
SELECT mem.firstname AS memfname, mem.surname AS memsname, rec.firstname AS recfname, rec.surname AS recsname
FROM cd.members mem
LEFT OUTER JOIN cd.members rec
ON rec.memid = mem.recommendedby
ORDER BY memsname, memfname;          

-- 5. Produce a list of all members who have used tennis courts
SELECT DISTINCT CONCAT(firstname ,' ', surname) AS member, fac.name as facility
FROM cd.members mem
INNER JOIN cd.bookings book
ON mem.memid = book.memid
JOIN cd.facilities fac
ON book.facid = fac.facid
WHERE fac.name ILIKE 'tennis%'
ORDER BY member, facility

-- 6. Produce a list of costly bookings.
SELECT CONCAT(firstname ,' ', surname) AS member, fac.name as facility, 
CASE 
WHEN mem.memid = 0 
THEN book.slots*fac.guestcost
ELSE book.slots*fac.membercost
END AS cost
FROM cd.members mem
INNER JOIN cd.bookings book
ON mem.memid = book.memid
JOIN cd.facilities fac
ON book.facid = fac.facid
WHERE book.starttime >= '2012-09-14' AND book.starttime < '2012-09-15' AND (
			(mem.memid = 0 AND book.slots*fac.guestcost > 30) OR
			(mem.memid != 0 AND book.slots*fac.membercost > 30)
		)
ORDER BY cost DESC

-- 7. Produce a list of all members, along with their recommended, using no joints.
SELECT DISTINCT CONCAT(firstname ,' ', surname) AS member, 
(SELECT CONCAT(firstname ,' ', surname) AS recommender
FROM cd.members mem
WHERE mem.memid = rec.recommendedby)
FROM cd.members rec
ORDER BY member 

-- 8. Produce a list of costly bookings, using a subquery
SELECT member, facility, cost FROM (
	SELECT 
		mem.firstname || ' ' || mem.surname AS member,
		fac.name as facility,
		CASE
			WHEN mem.memid = 0 THEN
				book.slots*fac.guestcost
			ELSE
				book.slots*fac.membercost
		END AS cost
		FROM
			cd.members mem
			INNER JOIN cd.bookings book
				ON mem.memid = book.memid
			INNER JOIN cd.facilities fac
				ON book.facid = fac.facid
		WHERE
			book.starttime >= '2012-09-14' AND
			book.starttime < '2012-09-15'
	) AS bookings
	WHERE cost > 30
ORDER BY cost DESC;    