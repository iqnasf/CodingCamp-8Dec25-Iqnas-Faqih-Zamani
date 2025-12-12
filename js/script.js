// Select DOM elements
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const todoBody = document.getElementById("todo-body");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterSelect = document.getElementById("filter-todo");

// Initialize todos array from LocalStorage or empty array
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// --- Functions ---

// 1. Function to save to LocalStorage
const saveLocal = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

// 2. Function to Render the list based on filter
const renderTodos = () => {
  const filterValue = filterSelect.value;
  todoBody.innerHTML = ""; // Clear current list

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (filterValue === "all") return true;
    if (filterValue === "completed") return todo.completed;
    if (filterValue === "pending") return !todo.completed;
  });

  if (filteredTodos.length === 0) {
    todoBody.innerHTML = '<tr id="empty-msg"><td colspan="4" style="text-align: center; color: #94a3b8;">No task found</td></tr>';
    return;
  }

  filteredTodos.forEach((todo) => {
    // Create table row
    const row = document.createElement("tr");

    row.innerHTML = `
            <td class="${todo.completed ? "completed-task" : ""}">${todo.text}</td>
            <td>${todo.date ? todo.date : "No Date"}</td>
            <td>
                <span class="status-badge ${todo.completed ? "status-completed" : "status-pending"}">
                    ${todo.completed ? "Completed" : "Pending"}
                </span>
            </td>
            <td>
                <button onclick="toggleStatus(${todo.id})" class="action-btn check" title="Toggle Status">✔</button>
                <button onclick="deleteTodo(${todo.id})" class="action-btn delete" title="Delete">✖</button>
            </td>
        `;
    todoBody.appendChild(row);
  });
};

// 3. Function to Add Todo
const addTodo = () => {
  const text = taskInput.value.trim();
  const date = dateInput.value;

  // VALIDATION: Check if input is empty
  if (text === "") {
    alert("Please enter a task name!");
    return;
  }

  const newTodo = {
    id: Date.now(), // Generate unique ID based on timestamp
    text: text,
    date: date,
    completed: false,
  };

  todos.push(newTodo);
  saveLocal();
  renderTodos();

  // Clear inputs
  taskInput.value = "";
  dateInput.value = "";
};

// 4. Function to Delete specific Todo
window.deleteTodo = (id) => {
  todos = todos.filter((todo) => todo.id !== id);
  saveLocal();
  renderTodos();
};

// 5. Function to Toggle Completed Status
window.toggleStatus = (id) => {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveLocal();
  renderTodos();
};

// 6. Function to Delete All
const deleteAll = () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    saveLocal();
    renderTodos();
  }
};

// --- Event Listeners ---
addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAll);
filterSelect.addEventListener("change", renderTodos);

// Allow pressing "Enter" key to add task
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

// Initial Render
renderTodos();
