const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const emptyState = document.querySelector("#emptyState");
const summary = document.querySelector("#summary");
const clearCompleted = document.querySelector("#clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getFilteredTodos() {
    if (currentFilter === "active") {
        return todos.filter((todo) => !todo.completed);
    }

    if (currentFilter === "completed") {
        return todos.filter((todo) => todo.completed);
    }

    return todos;
}

function updateSummary() {
    const activeCount = todos.filter((todo) => !todo.completed).length;
    const taskWord = activeCount === 1 ? "task" : "tasks";
    summary.textContent = `${activeCount} ${taskWord} left`;
}

function renderTodos() {
    todoList.innerHTML = "";

    const filteredTodos = getFilteredTodos();
    emptyState.hidden = filteredTodos.length > 0;

    filteredTodos.forEach((todo) => {
        const item = document.createElement("li");
        item.className = `todo-item${todo.completed ? " completed" : ""}`;
        item.dataset.id = todo.id;

        const checkbox = document.createElement("input");
        checkbox.className = "todo-checkbox";
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", "Mark task complete");

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "x";
        deleteButton.setAttribute("aria-label", "Delete task");

        item.append(checkbox, text, deleteButton);
        todoList.appendChild(item);
    });

    updateSummary();
    saveTodos();
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (!text) {
        todoInput.focus();
        return;
    }

    todos.unshift({
        id: Date.now().toString(),
        text,
        completed: false
    });

    todoInput.value = "";
    renderTodos();
});

todoList.addEventListener("click", (event) => {
    const item = event.target.closest(".todo-item");

    if (!item) {
        return;
    }

    if (event.target.classList.contains("todo-checkbox")) {
        todos = todos.map((todo) => {
            if (todo.id === item.dataset.id) {
                return { ...todo, completed: event.target.checked };
            }

            return todo;
        });
    }

    if (event.target.classList.contains("delete-btn")) {
        todos = todos.filter((todo) => todo.id !== item.dataset.id);
    }

    renderTodos();
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderTodos();
    });
});

clearCompleted.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    renderTodos();
});

renderTodos();
