# StudyTrack — Student Assignment and Deadline Tracker

StudyTrack is a browser-based application that helps students organize assignments, monitor deadlines, and track completion status.

## Features

### Assignment Management
- Add assignments with a title, course, due date, and priority.
- Mark assignments as completed or pending.
- Delete assignments.
- Save assignment data using browser localStorage.

### Dashboard and Organization
- View Total, Pending, Upcoming, Completed, and Overdue assignment summaries.
- Search assignments by title or course.
- Filter assignments by status.
- Sort assignments by due date or priority.
- Clear active search and filter settings.

## Technologies
- HTML5
- CSS3
- JavaScript
- Browser localStorage
- Node.js and npm
- Playwright Test
- ESLint
- html-validate
- Git and GitHub
- GitHub Actions

## Running the Application

1. Install Node.js.
2. Clone this repository.
3. Open the project folder in your terminal.
4. Install dependencies:

   `npm install`

5. Open `index.html` using VS Code Live Server.

## Automated Testing

Run all quality checks with:

`npm run check`

This command performs:

1. **HTML validation:** Checks the HTML structure using html-validate.
2. **JavaScript linting:** Checks JavaScript code using ESLint.
3. **Browser automation:** Runs Playwright tests using Chromium.

### Playwright Test Coverage

The current automated test suite covers seven scenarios:

- Adding an assignment.
- Updating dashboard summary counts.
- Searching assignments by title.
- Filtering overdue assignments.
- Marking assignments as completed.
- Deleting assignments.
- Preserving assignments after a page refresh.

### Continuous Integration

GitHub Actions automatically runs the quality checks when changes are pushed to the `main` branch or when a pull request targets `main`.

## Data Storage and Limitations

Assignment records are stored in the browser's localStorage on the current device and browser.

The current application does not provide user accounts, a server-side database, or automatic synchronization between devices or browsers. Clearing browser storage may remove saved assignments.
