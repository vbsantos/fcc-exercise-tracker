# FreeCodeCamp - Back End Development and APIs Course

- [x] You should provide your own project, not the example URL.
- [x] You can `POST` to `/api/users` with form data `username` to create a new user.
- [x] The returned response from `POST /api/users` with form data `username` will be an object with `username` and `_id` properties.
- [x] You can make a `GET` request to `/api/users` to get a list of all users.
- [x] The `GET` request to `/api/users` returns an array.
- [x] Each element in the array returned from `GET /api/users` is an object literal containing a user's `username` and `_id`.
- [x] You can `POST` to `/api/users/:_id/exercises` with form data `description`, `duration`, and optionally `date`. If no date is supplied, the current date will be used.
- [x] The response returned from `POST /api/users/:_id/exercises` will be the user object with the exercise fields added.
- [x] You can make a `GET` request to `/api/users/:_id/logs` to retrieve a full exercise log of any user.
- [x] A request to a user's log `GET /api/users/:_id/logs` returns a user object with a `count` property representing the number of exercises that belong to that user.
- [x] A `GET` request to `/api/users/:_id/logs` will return the user object with a `log` array of all the exercises added.
- [x] Each item in the `log` array that is returned from `GET /api/users/:_id/logs` is an object that should have a `description`, `duration`, and `date` properties.
- [x] The `description` property of any object in the `log` array that is returned from `GET /api/users/:_id/logs` should be a string.
- [x] The `duration` property of any object in the `log` array that is returned from `GET /api/users/:_id/logs` should be a number.
- [x] The `date` property of any object in the `log` array that is returned from `GET /api/users/:_id/logs` should be a string. Use the `dateString` format of the `Date` API.
- [x] You can add `from`, `to` and `limit` parameters to a `GET /api/users/:_id/logs` request to retrieve part of the log of any user. `from` and `to` are dates in `yyyy-mm-dd` format. `limit` is an integer of how many logs to send back.

## Certification Project - Exercise Tracker

Build a full stack JavaScript app that is functionally similar to this: [https://exercise-tracker.freecodecamp.rocks](https://exercise-tracker.freecodecamp.rocks/). Working on this project will involve you writing your code using one of the following methods:

- Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/) and complete your project locally.
- Use [our Replit starter project](https://replit.com/github/freeCodeCamp/boilerplate-project-exercisetracker) to complete your project.
- Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

If you use Replit, follow these steps to set up the project:

- Start by importing the project on Replit.
- Next, you will see a `.replit` window.
- Select `Use run command` and click the `Done` button.

When you are done, make sure a working demo of your project is hosted somewhere public. Then submit the URL to it in the Solution Link field. Optionally, also submit a link to your project's source code in the GitHub Link field.

---

Your responses should have the following structures.

Exercise:

```js
{
  username: "fcc_test",
  description: "test",
  duration: 60,
  date: "Mon Jan 01 1990",
  _id: "5fb5853f734231456ccb3b05"
}
```

User:

```js
{
  username: "fcc_test",
  _id: "5fb5853f734231456ccb3b05"
}
```

Log:

```js
{
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }]
}
```

---

**Hint:** For the `date` property, the `toDateString` method of the `Date` API can be used to achieve the expected output.

## Unit Tests

```text
PASS  __tests__/unit/Exercise.Service.spec.ts
  ExerciseService
    createExercise
      ✓ should return null if the userRepository response is null (3 ms)
      ✓ should create exercise if both the repositories response are not null (1 ms)
    getExercisesByUserId
      ✓ should return null if user does not exist (1 ms)
      ✓ should return null if no exercises are found (1 ms)
      ✓ should return the expected result when user and exercises are found (1 ms)

 PASS  __tests__/unit/User.Service.spec.ts
  UserService
    createUser
      ✓ should return null when user already exists (3 ms)
      ✓ should create user and return _id and username (1 ms)
      ✓ should return null when user creation fails (1 ms)
    getUsers
      ✓ should return users from the repository (1 ms)
      ✓ should return empty array from the repository if it have no users
      ✓ should return empty array if user index fails
    getUserById
      ✓ should return _id and username from the respository (1 ms)
      ✓ should return null from the repository if not found (1 ms)

---------------------|---------|----------|---------|---------|-------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files            |     100 |      100 |     100 |     100 |
 Exercise.Service.ts |     100 |      100 |     100 |     100 |
 User.Service.ts     |     100 |      100 |     100 |     100 |
---------------------|---------|----------|---------|---------|-------------------
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        1.742 s, estimated 3 s
```

## Integration Tests

```text
 PASS  __tests__/integration/Api.spec.ts
  API Integrations tests
    POST /users
      ✓ Deve criar um usuário e retornar seus dados (344 ms)
    POST /users/:_id/exercises
      ✓ Deve criar um exercício para um usuário e retornar seus dados (203 ms)
    GET /users
      ✓ Deve retornar uma lista de usuários (48 ms)
    GET /users/:_id/logs
      ✓ Deve retornar o registro de exercícios de um usuário (42 ms)

-------------------------|---------|----------|---------|---------|-----------------------------------------------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-----------------------------------------------------------
All files                |   80.75 |    45.28 |   85.18 |      80 |
 src                     |   81.57 |        0 |       0 |   83.78 |
  server.ts              |   81.57 |        0 |       0 |   83.78 | 51-52,57-58,63-64
 src/Controllers         |   73.77 |       48 |     100 |   72.88 |
  App.Controller.ts      |    70.9 |    43.47 |     100 |   69.81 | 56-57,63-66,85-88,112-113,125-128,158-159,163-166,178-181
  HttpStatusCode.Enum.ts |     100 |      100 |     100 |     100 |
 src/Repositories        |   87.14 |    58.82 |     100 |   85.93 |
  Exercise.Repository.ts |   79.31 |       60 |     100 |   77.77 | 84-85,89-90,94-95
  Repository.ts          |     100 |      100 |     100 |     100 |
  User.Repository.ts     |    90.9 |       50 |     100 |   90.32 | 73-75,91
 src/Services            |   79.54 |       25 |   85.71 |    77.5 |
  Exercise.Service.ts    |    90.9 |       50 |     100 |      90 | 72,102
  User.Service.ts        |   68.18 |        0 |      75 |      65 | 25,30,40,47-53
-------------------------|---------|----------|---------|---------|-----------------------------------------------------------
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.812 s, estimated 4 s
```
