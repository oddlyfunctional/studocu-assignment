# Q&A Sample Application

This project was created as an assignment for the recruitment process at [studocu](https://www.studocu.com).

## How to run

The simplest way to run the application is with the following command:

```bash
git clone git@github.com:oddlyfunctional/studocu-assignment.git
cd studocu-assignment
npm install
npm run dev
```

After that just navigate to http://localhost:3000 on your browser!

---

**Note:** the application can also be run with `npm start`, but it needs to be built first with `npm run build`.

### With persistence

The application runs with the persistence disabled by default. If you want to enable it, please follow these instructions:

1. Install the PostgreSQL client (e.g. for OSX, this can be done with `brew install postgresql`)
2. Add a `.env.local` file to the root of the project with the following content (please replace the specific values according to your configuration):

```bash
DATABASE_URL="postgres://username@localhost:5432/studocu?sslmode=disable"
```

3. Run `npm run db:setup`.
4. Start the application with the command `npm run dev:persistence`.

## Running tests

You can run all unit tests with:

```bash
npm test
```

For the E2E tests, due to some issues configuring Playwright, the process is slightly more complicated:

```bash
# First prepare the database for running tests.
# Note that a .env.test file similar to .env.local is required.
npm run db:test:setup

# Boot the application
NODE_ENV=test npm run dev:persistence

# In another shell, run the tests
npm run e2e
```

**Note:** For now there is only 1 E2E test, testing the application with the persistence layer enabled.
