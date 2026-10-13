
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedBtn = document.getElementById("clear-completed");

// Load saved tasks from the browser
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("geethanjali-todo-tasks")) || [];
} catch (error) {
    tasks = [];
}

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("geethanjali-todo-tasks", JSON.stringify(tasks));
}

// Display tasks on the page
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("aria-label", "Delete " + task.text);

        deleteBtn.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remaining + (remaining === 1
        ? " task remaining"
        : " tasks remaining");

    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
    clearCompletedBtn.style.display =
        tasks.some(function (task) {
            return task.completed;
        }) ? "block" : "none";
}

// Add a new task
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Remove all completed tasks
clearCompletedBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});

// Show saved tasks when the page opens
renderTasks();
