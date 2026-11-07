
const STORAGE_KEY = "studyTrackAssignments";

const form = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortSelect = document.getElementById("sortSelect");
const clearFiltersButton = document.getElementById("clearFilters");

let assignments = loadAssignments();

function loadAssignments() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.course === "string" &&
            typeof item.dueDate === "string"
        ).map(item => ({
            id: item.id,
            title: item.title,
            course: item.course,
            dueDate: item.dueDate,
            priority: ["Low", "Medium", "High"].includes(item.priority)
                ? item.priority
                : "Medium",
            completed: Boolean(item.completed)
        }));
    } catch (error) {
        console.error("Could not load assignments:", error);
        return [];
    }
}

function saveAssignments() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (error) {
        console.error("Could not save assignments:", error);
        alert("Your assignments could not be saved. Check your browser storage.");
    }
}

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isOverdue(assignment) {
    return !assignment.completed && assignment.dueDate < getToday();
}

function getStatus(assignment) {
    if (assignment.completed) return "completed";
    if (isOverdue(assignment)) return "overdue";
    return "pending";
}

function updateSummary() {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const overdue = assignments.filter(a => isOverdue(a)).length;
    const upcoming = assignments.filter(a =>
        !a.completed && a.dueDate >= getToday()
    ).length;

    const pending = assignments.filter(a => !a.completed).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("upcomingCount").textContent = upcoming;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("overdueCount").textContent = overdue;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function createId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString() + Math.random().toString(16).slice(2);
}

function renderAssignments() {
    updateSummary();

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const sortMethod = sortSelect.value;

    let filteredAssignments = assignments.filter(assignment => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(searchTerm) ||
            assignment.course.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            getStatus(assignment) === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    if (sortMethod === "due-asc") {
        filteredAssignments.sort((a, b) =>
            a.dueDate.localeCompare(b.dueDate)
        );
    } else if (sortMethod === "due-desc") {
        filteredAssignments.sort((a, b) =>
            b.dueDate.localeCompare(a.dueDate)
        );
    } else if (sortMethod === "priority") {
        const priorityOrder = {
            High: 3,
            Medium: 2,
            Low: 1
        };

        filteredAssignments.sort((a, b) =>
            priorityOrder[b.priority] - priorityOrder[a.priority] ||
            a.dueDate.localeCompare(b.dueDate)
        );
    }

    const resultsCount = document.getElementById("resultsCount");
    resultsCount.textContent =
        `${filteredAssignments.length} assignment(s) shown`;

    if (filteredAssignments.length === 0) {
        assignmentList.innerHTML =
            '<p class="empty-message">No assignments found.</p>';
        return;
    }

    assignmentList.innerHTML = filteredAssignments.map(assignment => {
        const status = getStatus(assignment);

        const statusLabel = status.charAt(0).toUpperCase() +
            status.slice(1);

        return `
            <article class="assignment-card ${status}"
                data-id="${escapeHTML(assignment.id)}">

                <h3>${escapeHTML(assignment.title)}</h3>

                <p><strong>Course:</strong>
                    ${escapeHTML(assignment.course)}</p>

                <p><strong>Due date:</strong>
                    ${escapeHTML(assignment.dueDate)}</p>

                <p><strong>Priority:</strong>
                    ${escapeHTML(assignment.priority)}</p>

                <span class="status ${status}">
                    ${statusLabel}
                </span>

                <div class="card-actions">
                    <button type="button" data-action="toggle">
                        ${assignment.completed
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                    </button>

                    <button type="button"
                        class="delete-btn"
                        data-action="delete">
                        Delete
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!title || !course || !dueDate) {
        alert("Please complete all assignment fields.");
        return;
    }

    const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(dueDate) &&
        !Number.isNaN(Date.parse(dueDate)) &&
        new Date(dueDate + "T00:00:00").toISOString().slice(0, 10) === dueDate;

    if (!dateIsValid) {
        alert("Please enter a valid due date.");
        return;
    }

    if (!["Low", "Medium", "High"].includes(priority)) {
        alert("Please select a valid priority.");
        return;
    }

    const newAssignment = {
        id: createId(),
        title,
        course,
        dueDate,
        priority,
        completed: false
    };

    assignments.push(newAssignment);

    saveAssignments();

    form.reset();

    searchInput.value = "";
    statusFilter.value = "all";
    sortSelect.value = "due-asc";

    renderAssignments();
});

assignmentList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const card = button.closest(".assignment-card");
    if (!card) return;

    const assignmentId = card.dataset.id;
    const action = button.dataset.action;

    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    if (action === "toggle") {
        assignment.completed = !assignment.completed;
    }

    if (action === "delete") {
        const confirmed = confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (!confirmed) return;

        assignments = assignments.filter(a => a.id !== assignmentId);
    }

    saveAssignments();
    renderAssignments();
});

searchInput.addEventListener("input", renderAssignments);
statusFilter.addEventListener("change", renderAssignments);
sortSelect.addEventListener("change", renderAssignments);

clearFiltersButton.addEventListener("click", function() {
    searchInput.value = "";
    statusFilter.value = "all";
    sortSelect.value = "due-asc";

    renderAssignments();
});

document.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        renderAssignments();
    }
});

renderAssignments();
