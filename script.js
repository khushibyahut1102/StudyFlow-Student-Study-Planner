const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const subjectInput = document.getElementById("subjectInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem("studyFlowTasks")) || [];
  if (!Array.isArray(tasks)) tasks = [];
} catch {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem("studyFlowTasks", JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  pendingTasks.textContent = tasks.length - completed;
}

function renderTasks() {
  taskList.replaceChildren();

  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const subject = document.createElement("p");
    subject.textContent = "Subject: " + task.subject;

    details.append(title, subject);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.textContent = task.completed ? "Undo" : "Complete";

    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    item.append(details, actions);
    taskList.appendChild(item);
  });

  updateStats();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const title = taskInput.value.trim();
  const subject = subjectInput.value.trim();

  if (!title || !subject) {
    alert("Please enter both task name and subject.");
    return;
  }

  tasks.unshift({
    id: Date.now() + Math.random(),
    title: title,
    subject: subject,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

function setMotivation() {
  const quotes = [
    "Small steps every day lead to big results.",
    "Believe in yourself and keep learning!",
    "Consistency is the key to success.",
    "Every expert was once a beginner."
  ];

  const quoteText = document.getElementById("quoteText");
  const index = Math.floor(Math.random() * quotes.length);

  quoteText.textContent = quotes[index];
}

renderTasks();
setMotivation();