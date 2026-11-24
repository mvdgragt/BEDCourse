# Assignment: End-to-End Tests for Three Sundsgården APIs

## Getting started

In the video we tested the employees API together. Now it's your turn. You get three new Sundsgården APIs, and your job is to write end-to-end tests that prove they follow the rules in this document. The rules in this document are the **spec** (specification): when the code and the spec disagree, the spec wins.

There are 9 tasks: 3 easy, 3 medium and 3 hard. Do them in order: each level builds on the one before.

| Level  | API            | Code              | Your tests               |
| ------ | -------------- | ----------------- | ------------------------ |
| Easy   | Menu           | `src/menu.ts`     | `tests/menu.test.ts`     |
| Medium | Table bookings | `src/bookings.ts` | `tests/bookings.test.ts` |
| Hard   | Staff shifts   | `src/shifts.ts`   | `tests/shifts.test.ts`   |

**Setup**

1. Unzip the starter project and open it in VS Code.
2. Run `npm install`.
3. Run `npm test`. You should see 1 test passing and 10 marked as _todo_.
4. Optional: run `npm run dev` and explore the APIs in Insomnia on `http://localhost:4000`.

The test files already have a `describe` block for every task and a few `it.todo(...)` lines to get you going. Replace each `it.todo` with a real test, and add more tests of your own.

**Rules for every test you write**

- Use a fresh app for every test (`beforeEach` is already set up for you).
- Follow **AAA**: Arrange, Act, Assert.
- Check the **status code** _and_ the **body**, not just one of them.
- For every happy path, write at least one unhappy path.
- Give each test a name that describes the behaviour, e.g. `'rejects a negative price with 400'`.
- Don't change the code in `src/` (except in task H3).

## Easy: the Menu API

The restaurant's menu. You can read it, filter it and add new dishes.

**Endpoints**

| Method | Path            | What it does                           | Success |
| ------ | --------------- | -------------------------------------- | ------- |
| GET    | `/api/menu`     | List dishes (optional filters, see E3) | 200     |
| GET    | `/api/menu/:id` | Get one dish                           | 200     |
| POST   | `/api/menu`     | Add a dish                             | 201     |

**Rules for a new dish**

- `name`: text, required. Spaces around it are trimmed, and only-spaces counts as empty.
- `price`: a whole number of kronor, above 0 and at most 1000.
- `category`: `STARTER`, `MAIN` or `DESSERT`.
- `vegetarian`: `true` or `false`. Optional; if left out, it becomes `false`.
- Invalid data gives **400** with `issues` naming each wrong field. An unknown id gives **404**.

**Starting data**

| id  | name                | price | category | vegetarian |
| --- | ------------------- | ----- | -------- | ---------- |
| 1   | Toast Skagen        | 145   | STARTER  | false      |
| 2   | Grilled Arctic Char | 295   | MAIN     | false      |
| 3   | Mushroom Risotto    | 245   | MAIN     | true       |
| 4   | Cloudberry Parfait  | 125   | DESSERT  | true       |

### E1 · Read the menu

The first test is already written for you as an example.

- [ ] `GET /api/menu` returns 4 dishes that match `DishSchema` (done for you)
- [ ] `GET /api/menu/4` returns the Cloudberry Parfait
- [ ] Unknown ids give 404: try `99`, `abc` and `0`

### E2 · Add a dish

- [ ] A valid dish gets **201**, id 5, and `vegetarian: false` when you leave it out
- [ ] After adding, the list has 5 dishes
- [ ] 400 for a negative price, a price sent as text (`"210"`), a price with decimals, and an unknown category
- [ ] 400 for a name that is only spaces
- [ ] Check that `issues` names the right field each time

### E3 · Filter the menu

Filters are sent as a **query string**: `/api/menu?category=MAIN&vegetarian=true`.

- [ ] `?category=MAIN` returns only main courses (how many?)
- [ ] `?vegetarian=true` returns only vegetarian dishes
- [ ] Both filters together
- [ ] A filter that matches nothing returns **200 with an empty list**, not 404
- [ ] An invalid filter (`?category=SNACK` or `?vegetarian=yes`) gives 400

**Hint:** with Supertest, you can also write `request(app).get('/api/menu').query({ category: 'MAIN' })`.

## Medium: the Table Bookings API

Guests book a table for a date and time. Now there are **business rules**: rules about how the restaurant works, not just about data types.

**Endpoints**

| Method | Path                            | What it does                         | Success |
| ------ | ------------------------------- | ------------------------------------ | ------- |
| GET    | `/api/bookings?date=2026-12-24` | List bookings (date filter optional) | 200     |
| GET    | `/api/bookings/:id`             | Get one booking                      | 200     |
| POST   | `/api/bookings`                 | Make a booking                       | 201     |
| PATCH  | `/api/bookings/:id`             | Change party size, time and/or table | 200     |
| POST   | `/api/bookings/:id/cancel`      | Cancel a booking                     | 200     |

**Rules**

- `guestName`: text, required.
- `partySize`: whole number from **1 to 8**.
- `date`: `YYYY-MM-DD`, and it must be a real date.
- `time`: one of the three seatings, `17:00`, `19:00` or `21:00`.
- `tableId`: whole number from **1 to 5**.
- New bookings get `status: "CONFIRMED"`.
- **No double bookings:** a table can only have one CONFIRMED booking per date and time, otherwise you get **409 Conflict**. Cancelled bookings don't count.
- **PATCH** may only change `partySize`, `time` and `tableId`; any other field is ignored. An empty body gives 400. A cancelled booking can't be changed (409).
- Cancelling an already cancelled booking gives 409.
- Invalid data gives 400 with `issues`, and an unknown id gives 404.

**Starting data**

| id  | guestName | partySize | date       | time  | tableId | status    |
| --- | --------- | --------- | ---------- | ----- | ------- | --------- |
| 1   | Andersson | 4         | 2026-12-24 | 19:00 | 2       | CONFIRMED |
| 2   | Lind      | 2         | 2026-12-24 | 17:00 | 1       | CONFIRMED |
| 3   | Nilsson   | 6         | 2026-12-31 | 21:00 | 5       | CANCELLED |

### M1 · Make a booking, and test the edges

New jargon: **boundary value testing**. Bugs love to hide at the edges of a rule. If the rule is "1 to 8 guests", test 0, 1, 8 and 9: two values that should pass and two that should fail.

- [ ] A valid booking gets 201, id 4 and status CONFIRMED, and matches `BookingSchema`
- [ ] Boundary values for `partySize`: 0, 1, 8 and 9
- [ ] Boundary values for `tableId`
- [ ] 400 for an impossible date (`2026-13-40`), a wrong date format (`24/12/2026`) and a time that isn't a seating (`18:00`)
- [ ] `GET /api/bookings?date=2026-12-24` returns only the bookings on that day

**Tip:** `it.each` runs the same test with different data, so you don't have to copy-paste:

```ts
it.each([
  [0, 400],
  [1, 201],
  [8, 201],
  [9, 400],
])("partySize %i gives %i", async (partySize, expected) => {
  await request(app)
    .post("/api/bookings")
    .send({ ...booking, partySize })
    .expect(expected);
});
```

### M2 · Double bookings and cancelling

- [ ] Booking Andersson's table at the same date and time gives 409
- [ ] The same table at a different time is fine
- [ ] Nilsson's slot (cancelled) can be booked again
- [ ] Journey: cancel Andersson, then book the free slot. The second booking should succeed.
- [ ] Cancelling twice gives 409; cancelling an unknown id gives 404

### M3 · Change a booking with PATCH

**PATCH** means "change only what I send". **PUT** would mean "replace everything".

- [ ] Changing only `partySize` keeps every other field the same (check the whole body)
- [ ] The change is really saved: a GET afterwards shows it
- [ ] Moving into a slot that's taken gives 409, **and nothing changes** (check with a GET)
- [ ] A booking doesn't conflict with itself (changing only the party size works)
- [ ] An empty body gives 400; `partySize: 20` gives 400
- [ ] Trying to change `guestName` doesn't change it
- [ ] Changing a cancelled booking gives 409; an unknown id gives 404

## Hard: the Staff Shifts API

The manager posts shifts, staff claim them, and the manager marks them as done. This API has **users**, **permissions** and a **life cycle**.

**Who are you? Two headers on every request**

| Header      | Value                             |
| ----------- | --------------------------------- |
| `x-role`    | `ADMIN` or `STAFF`                |
| `x-user-id` | A positive whole number, e.g. `4` |

This is a simplified login, good enough for practice. In real apps you'd use a session or a token.

**401 vs 403, the difference that matters**

- **401 Unauthorized**: "I don't know who you are." Headers are missing or wrong.
- **403 Forbidden**: "I know who you are, but you're not allowed to do this."

Like a hotel: no keycard is 401; a guest keycard on the staff room door is 403.

**Endpoints**

| Method | Path                                     | Who              | What it does                    | Success |
| ------ | ---------------------------------------- | ---------------- | ------------------------------- | ------- |
| GET    | `/api/shifts?status=OPEN&page=1&limit=5` | Anyone logged in | List shifts, one page at a time | 200     |
| GET    | `/api/shifts/:id`                        | Anyone logged in | Get one shift                   | 200     |
| POST   | `/api/shifts`                            | ADMIN            | Create a shift                  | 201     |
| POST   | `/api/shifts/:id/claim`                  | STAFF            | Take an open shift              | 200     |
| POST   | `/api/shifts/:id/complete`               | ADMIN            | Mark a shift as done            | 200     |
| DELETE | `/api/shifts/:id`                        | ADMIN            | Delete an open shift            | 204     |

**Rules (the spec)**

- A shift has `date` (`YYYY-MM-DD`), `start` and `end` (`HH:MM`), and `position` (`WAITER`, `RUNNER` or `HEAD_WAITER`).
- `end` must be **after** `start`. Equal times are not allowed.
- **Life cycle:** a new shift is `OPEN` → claiming makes it `ASSIGNED` (with `assignedTo` = your user id) → completing makes it `COMPLETED`. Any other move gives **409**.
- Only `OPEN` shifts can be deleted.
- A staff member can't have two shifts on the same date (409).
- **Pagination:** the list returns `{ data, page, limit, total }`. `page` starts at **1**, `limit` defaults to **5** (max 20), shifts come in id order, and `total` is the number of shifts **that match the filter**.
- Authentication is checked first: no valid headers means 401, even if the shift doesn't exist.

**Starting data**

| id  | date       | start–end   | position    | status    | assignedTo |
| --- | ---------- | ----------- | ----------- | --------- | ---------- |
| 1   | 2026-12-24 | 16:00–23:00 | WAITER      | OPEN      | –          |
| 2   | 2026-12-24 | 16:00–23:00 | RUNNER      | ASSIGNED  | 2          |
| 3   | 2026-12-24 | 11:00–16:00 | HEAD_WAITER | OPEN      | –          |
| 4   | 2026-12-25 | 12:00–20:00 | WAITER      | OPEN      | –          |
| 5   | 2026-12-25 | 12:00–20:00 | RUNNER      | COMPLETED | 3          |
| 6   | 2026-12-31 | 17:00–23:59 | WAITER      | OPEN      | –          |
| 7   | 2026-12-31 | 17:00–23:59 | RUNNER      | OPEN      | –          |

The test file gives you two helpers: `.set(admin)` and `.set(staff(4))`.

### H1 · Who is allowed to do what?

Build a **permission matrix**: every protected endpoint, tested as ADMIN and as STAFF. Use `it.each` so the whole matrix is one readable table.

- [ ] 401 for: no headers, an unknown role (`CHEF`), a missing user id, and a user id that isn't a number
- [ ] For every ADMIN-only endpoint: STAFF gets 403, ADMIN succeeds
- [ ] For claim: ADMIN gets 403, STAFF succeeds
- [ ] 401 comes before 404: no headers on shift 99 is still 401

### H2 · The shift life cycle

Think of a shift as a **state machine**: it can only move along the arrows OPEN → ASSIGNED → COMPLETED.

- [ ] Journey: ADMIN creates a shift, STAFF claims it, ADMIN completes it. Check `status` and `assignedTo` at every step, and check the new shift against `ShiftSchema`.
- [ ] Race: two staff members claim the same shift. The first wins; the second gets 409.
- [ ] Same-day rule: user 2 already works on 2026-12-24, so claiming shift 1 gives 409, but claiming shift 4 (another day) works.
- [ ] Illegal moves give 409: completing an OPEN shift, completing a COMPLETED shift, claiming a COMPLETED shift, deleting an ASSIGNED shift
- [ ] After deleting a shift, GET gives 404

### H3 · Bug hunt

The Shifts API has **at least two bugs**. Your job is to find them with tests.

1. Write tests for the list endpoint (pagination, filters, `total`) and for creating shifts, based **only on the spec above**. Don't read `src/shifts.ts` first!
2. A failing test means you found a bug, as long as your test matches the spec. Double-check that before you blame the code.
3. For each bug: leave the failing test in place, then fix the bug in `src/shifts.ts` and watch the test turn green.
4. In your README, write one sentence per bug: what was wrong and how you fixed it.

- [ ] Tests for page 1, page 2, `limit`, the `status` filter and `total`, checked against `ShiftPageSchema`
- [ ] Tests for the start/end rule
- [ ] Every bug found, fixed and explained

## Cheat sheet

```ts
// Send a request
await request(app).get('/api/menu/1')
await request(app).get('/api/menu').query({ category: 'MAIN' })
await request(app).post('/api/menu').send({ name: 'Soup', price: 95, category: 'STARTER' })
await request(app).patch('/api/bookings/2').send({ partySize: 5 })
await request(app).post('/api/shifts/1/claim').set(staff(4))

// Quick status check (fails the test if the status is different)
await request(app).delete('/api/shifts/3').set(admin).expect(204)

// Assertions you'll use a lot
expect(res.status).toBe(201)
expect(res.body).toEqual({ id: 5, ... })          // exactly this
expect(res.body).toMatchObject({ status: 'OPEN' }) // at least this
expect(res.body).toHaveLength(2)
expect(res.body.issues).toHaveProperty('price')
expect(() => DishSchema.parse(res.body)).not.toThrow()

// One test, many inputs
it.each([['abc'], ['0'], ['99']])('returns 404 for id %s', async (id) => { /* ... */ })
```

## Handing in

- [ ] All your tests are in the three files in `tests/`
- [ ] `npm test` runs with no failures (after your H3 fixes)
- [ ] Your README explains the bugs you found in H3
- [ ] Push the project to GitHub and share the link

You don't have to finish everything. Easy is the minimum; medium shows you've got it; hard is for those who want a challenge.
