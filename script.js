// StudyTrack — Sprint 1 Assignment Tracker

const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

let assignments =
    JSON.parse(localStorage.getItem("studyTrackAssignments")) || [];

// Save assignments in browser localStorage
function saveAssignments() {
    localStorage.setItem(
        "studyTrackAssignments",
        JSON.stringify(assignments)
    );
}

// Update total, pending, and completed counts
function updateSummary() {
    const total = assignments.length;

    const completed = assignments.filter(
        assignment => assignment.completed
    ).length;

    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("completedCount").textContent = completed;
}

// Safely display user-entered text
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Display assignments on the page
function renderAssignments() {
    assignmentList.innerHTML = "";

    if (assignments.length === 0) {
        assignmentList.innerHTML =
            "<p>No assignments yet. Add one above.</p>";
    }

    assignments.forEach(assignment => {
        const card = document.createElement("div");

        card.className = "assignment-card";

        if (assignment.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
            <h3>${escapeHTML(assignment.title)}</h3>

            <p>
                <strong>Course:</strong>
                ${escapeHTML(assignment.course)}
            </p>

            <p>
                <strong>Due date:</strong>
                ${escapeHTML(assignment.dueDate)}
            </p>

            <p>
                <strong>Priority:</strong>
                ${escapeHTML(assignment.priority)}
            </p>

            <div class="assignment-actions">
                <button onclick="toggleComplete('${assignment.id}')">
                    ${assignment.completed
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                </button>

                <button
                    class="delete-button"
                    onclick="deleteAssignment('${assignment.id}')">
                    Delete
                </button>
            </div>
        `;

        assignmentList.appendChild(card);
    });

    updateSummary();
}

// Add a new assignment
assignmentForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!title || !course || !dueDate) {
        alert("Please complete all required fields.");
        return;
    }

    const assignment = {
        id: crypto.randomUUID(),
        title: title,
        course: course,
        dueDate: dueDate,
        priority: priority,
        completed: false
    };

    assignments.push(assignment);

    saveAssignments();
    renderAssignments();

    assignmentForm.reset();
});

// Mark an assignment complete or incomplete
function toggleComplete(id) {
    assignments = assignments.map(assignment => {
        if (assignment.id === id) {
            assignment.completed = !assignment.completed;
        }

        return assignment;
    });

    saveAssignments();
    renderAssignments();
}

// Delete an assignment
function deleteAssignment(id) {
    assignments = assignments.filter(
        assignment => assignment.id !== id
    );

    saveAssignments();
    renderAssignments();
}

// Load saved assignments when the page opens
renderAssignments();
