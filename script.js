document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const errorMessage = document.createElement("p");

errorMessage.id = "error-message";
errorMessage.classList.add("error-message");
errorMessage.style.color = "red";
errorMessage.style.fontSize = "14px";
errorMessage.style.marginTop = "5px";
errorMessage.style.display = "none";

taskInput.parentNode.insertBefore(errorMessage, taskInput.nextSibling);

let editMode = false;
let currentTask = null;

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(taskText => addTaskToUI(taskText));
}

addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        errorMessage.textContent = "Task cannot be empty!";
        errorMessage.style.display = "block"; 
        return;
    }

    errorMessage.style.display = "none"; 

    if (editMode) {
        // Update task
        currentTask.querySelector("span").textContent = taskText;
        updateLocalStorage();
        addTaskBtn.textContent = "Add";
        editMode = false;
        currentTask = null; 
    } else {
        addTaskToUI(taskText);
        saveTaskToLocalStorage(taskText);
    }

    taskInput.value = "";
});

function addTaskToUI(taskText) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${taskText}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;

    taskList.appendChild(li);

    li.querySelector(".edit-btn").addEventListener("click", () => editTask(li));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(li));
}

function saveTaskToLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(taskItem) {
    taskInput.value = taskItem.querySelector("span").textContent;
    addTaskBtn.textContent = "Update";
    editMode = true;
    currentTask = taskItem;
}

function deleteTask(taskItem) {
    taskItem.remove();
    updateLocalStorage();
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll("#task-list li span").forEach(task => {
        tasks.push(task.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

taskInput.addEventListener("input", () => {
    errorMessage.style.display = "none";
});
