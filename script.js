// State management
let members = ["All Family", "Child 1", "Child 2"];
let currentMember = "All Family";
let tasks = [];

// DOM Elements
const memberSelect = document.getElementById("memberSelect");
const newMemberInput = document.getElementById("newMemberInput");
const addMemberBtn = document.getElementById("addMemberBtn");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const currentMemberName = document.getElementById("currentMemberName");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Initialize application
function init() {
    renderMembers();
    renderTasks();
}

// Populate Member Dropdown
function renderMembers() {
    memberSelect.innerHTML = "";
    members.forEach(member => {
        const option = document.createElement("option");
        option.value = member;
        option.textContent = member;
        if (member === currentMember) option.selected = true;
        memberSelect.appendChild(option);
    });
    currentMemberName.textContent = currentMember;
}

// Render Tasks based on selected member
function renderTasks() {
    taskList.innerHTML = "";
    
    const filteredTasks = currentMember === "All Family" 
        ? tasks 
        : tasks.filter(t => t.assignedTo === currentMember);

    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p style='color: #888;'>No tasks found.</p>";
    } else {
        filteredTasks.forEach((task, index) => {
            const li = document.createElement("li");
            if (task.completed) li.classList.add("completed");

            li.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
                    <span>${task.text} <small>(${task.assignedTo})</small></span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
            `;
            taskList.appendChild(li);
        });
    }

    updateProgress(filteredTasks);
}

// Add a new family member
addMemberBtn.addEventListener("click", () => {
    const name = newMemberInput.value.trim();
    if (name && !members.includes(name)) {
        members.push(name);
        currentMember = name;
        newMemberInput.value = "";
        renderMembers();
        renderTasks();
    }
});

// Change selected member
memberSelect.addEventListener("change", (e) => {
    currentMember = e.target.value;
    currentMemberName.textContent = currentMember;
    renderTasks();
});

// Add a new task
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
        const newTask = {
            id: Date.now(),
            text: text,
            assignedTo: currentMember === "All Family" ? "Child 1" : currentMember,
            completed: false
        };
        tasks.push(newTask);
        taskInput.value = "";
        renderTasks();
    }
});

// Toggle completion status
window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    renderTasks();
};

// Delete task
window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};

// Update progress bar
function updateProgress(filteredTasks) {
    if (filteredTasks.length === 0) {
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
        return;
    }
    const completedCount = filteredTasks.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / filteredTasks.length) * 100);
    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "%";
}

init();
