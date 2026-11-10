# StudyTrack — Student Assignment and Deadline Tracker

StudyTrack is a browser-based application that helps students organize assignments, monitor deadlines, and track completion status.

## Features

- Add assignments with a title, course, due date, and priority.
- Mark assignments as completed or pending.
- Delete assignments.
- View total, pending, upcoming, completed, and overdue assignment counts.
- Search assignments by title or course.
- Filter assignments by status.
- Sort assignments by due date or priority.
- Save assignment data in the browser using localStorage.

## Technologies

- HTML5 and CSS3 — page structure and design.
- JavaScript — application functionality.
- localStorage — saves assignments in the browser.
- Node.js and npm — run the testing tools.
- Playwright — automatically tests the application in a browser.
- Git and GitHub — version control and project hosting.
- GitHub Actions — automatically runs the tests when code is pushed to main or a pull request targets main.

## Running the Application

1. Install Node.js.
2. Clone this repository.
3. Open the project folder.
4. Run `npm install`.
5. Open `index.html` using VS Code Live Server.

## Running the Automated Tests

Run:

`npm test`

Playwright opens the application in Chromium and checks that important features work.

The tests cover:
- Adding an assignment.
- Updating dashboard summary counts.
- Searching assignments.
- Filtering overdue assignments.
- Marking an assignment as completed.
- Deleting an assignment.
- Keeping assignments after a page refresh.
- Preventing submission when a required field is empty.
- Sorting assignments by due date.
- Adding and saving course-labelled assignments.

## How GitHub Actions Works

GitHub Actions automatically runs the Playwright tests when code is pushed to the `main` branch or when a pull request is opened against `main`.

If a test fails, the workflow reports a failure. If the tests pass, the workflow reports success. A test report is saved as a workflow artifact.

## Data Storage and Limitations

Assignments are stored in the browser's localStorage on the current device and browser. The application does not currently have user accounts, a server-side database, or automatic synchronization between devices or browsers.
