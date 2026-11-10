
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5500/index.html");

    // Start every test with an empty assignment list.
    await page.evaluate(() => {
        localStorage.removeItem("studyTrackAssignments");
    });

    await page.reload();
});

async function addAssignment(page, title, course, dueDate, priority = "Medium") {
    await page.locator("#title").fill(title);
    await page.locator("#course").fill(course);
    await page.locator("#dueDate").fill(dueDate);
    await page.locator("#priority").selectOption(priority);
    await page.getByRole("button", { name: "Add Assignment" }).click();
}

test("should add a new assignment", async ({ page }) => {
    await addAssignment(
        page,
        "Cloud Security Report",
        "Cloud Computing",
        "2026-11-20",
        "High"
    );

    await expect(
        page.locator(".assignment-card")
    ).toHaveCount(1);

    await expect(
        page.locator(".assignment-card")
    ).toContainText("Cloud Security Report");
});

test("should update summary counts", async ({ page }) => {
    await addAssignment(
        page,
        "IAM Research",
        "Cloud Security",
        "2026-11-20"
    );

    await expect(page.locator("#totalCount")).toHaveText("1");
    await expect(page.locator("#pendingCount")).toHaveText("1");
    await expect(page.locator("#completedCount")).toHaveText("0");
});

test("should search assignments by title", async ({ page }) => {
    await addAssignment(
        page,
        "IAM Research",
        "Cloud Security",
        "2026-11-20"
    );

    await page.locator("#searchInput").fill("IAM");

    await expect(
        page.locator(".assignment-card")
    ).toHaveCount(1);

    await page.locator("#searchInput").fill("Database");

    await expect(
        page.locator(".assignment-card")
    ).toHaveCount(0);
});

test("should filter overdue assignments", async ({ page }) => {
    await addAssignment(
        page,
        "Old Assignment",
        "Cloud Computing",
        "2020-01-01"
    );

    await addAssignment(
        page,
        "Future Assignment",
        "Cloud Security",
        "2099-12-31"
    );

    await page.locator("#statusFilter").selectOption("overdue");

    await expect(
        page.locator(".assignment-card")
    ).toHaveCount(1);

    await expect(
        page.locator(".assignment-card")
    ).toContainText("Old Assignment");
});

test("should mark an assignment as completed", async ({ page }) => {
    await addAssignment(
        page,
        "IAM Project",
        "Cloud Security",
        "2099-12-31"
    );

    await page.locator(
        '.assignment-card [data-action="toggle"]'
    ).click();

    await expect(
        page.locator(".assignment-card .status")
    ).toHaveText("Completed");

    await expect(page.locator("#completedCount")).toHaveText("1");
});

test("should delete an assignment", async ({ page }) => {
    await addAssignment(
        page,
        "Temporary Assignment",
        "Cloud Computing",
        "2099-12-31"
    );

    page.on("dialog", dialog => dialog.accept());

    await page.locator(
        '.assignment-card [data-action="delete"]'
    ).click();

    await expect(
        page.locator(".assignment-card")
    ).toHaveCount(0);

    await expect(page.locator("#totalCount")).toHaveText("0");
});

test("should preserve assignments after refreshing", async ({ page }) => {
    await addAssignment(
        page,
        "Persistent Assignment",
        "Cloud Security",
        "2099-12-31"
    );

    await page.reload();

    await expect(
        page.locator(".assignment-card")
    ).toContainText("Persistent Assignment");
});


/*
 * Dynamic course verification.
 * The course names below are test data for this run. Replace/add entries
 * freely; the test does not rely on a fixed list of real course names.
 */
test("should add and persist each course in the dynamic test data", async ({ page }) => {
    // Supply any comma-separated course names through STUDYTRACK_COURSES.
    // When no input is provided (for normal push/PR runs), use sample courses.
    const suppliedCourses = process.env.STUDYTRACK_COURSES || "";
    const coursesToVerify = suppliedCourses.trim()
        ? suppliedCourses.split(",").map(name => name.trim()).filter(Boolean)
        : ["Cloud Computing", "Blockchain Security"];

    for (const [index, courseName] of coursesToVerify.entries()) {
        const assignmentTitle = `Course verification ${index + 1}`;

        await addAssignment(
            page,
            assignmentTitle,
            courseName,
            "2099-12-31"
        );

        const card = page.locator(".assignment-card").filter({
            has: page.getByRole("heading", {
                name: assignmentTitle,
                exact: true
            })
        });

        // Confirm the new assignment and its course are shown in the UI.
        await expect(card).toBeVisible();
        await expect(card).toContainText(courseName);

        // Confirm the assignment (including its course name) was saved.
        const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("studyTrackAssignments") || "[]")
        );

        expect(stored.some(item =>
            item.title === assignmentTitle && item.course === courseName
        )).toBeTruthy();

        // Confirm the saved course remains visible after a browser refresh.
        await page.reload();

        const persistedCard = page.locator(".assignment-card").filter({
            has: page.getByRole("heading", {
                name: assignmentTitle,
                exact: true
            })
        });

        await expect(persistedCard).toBeVisible();
        await expect(persistedCard).toContainText(courseName);

        console.log(`COURSE_REPORT: PASS | ${courseName}`);
    }
});
