// Get references to various HTML elements
let form = document.getElementById("popupForm");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let timeInput = document.getElementById("timeInput");
let priorInput = document.getElementById("taskPriority");
let listContainer = document.getElementById("listContainer");
let storeData = [];

// Function to open the task input form
function openForm() {
  form.style.display = "block";
}

// Function to close the task input form
function closeForm() {
  form.style.display = "none";
}

// Function to save a new task
function saveTask() {
  if (textInput.value == "" || dateInput.value == "" || timeInput.value == "" || priorInput.value == "") {
    alert('Please fill the required fields!');
  } else {
    acceptData();
    closeForm();
    resetForm();
  }
}

// Function to create a new task and add it to the task list
function createTask(taskData) {
  const li = document.createElement("li");
  li.innerHTML = `${taskData.text}`;

  let detail = document.createElement("div");
  detail.className = 'detailsDrop';
  detail.id = 'dropDetail';
  detail.innerHTML = `${taskData.date} | ${taskData.time} | ${taskData.priority}`;
  li.appendChild(detail);

  // Set background color based on task priority
  if (taskData.priority == 'High') {
    li.style.backgroundColor = "rgba(248, 123, 165, 0.5)";
  } else if (taskData.priority == 'Medium') {
    li.style.backgroundColor = "rgba(217, 128, 244, 0.5)";
  } else if (taskData.priority == "Low") {
    li.style.backgroundColor = "rgba(243, 228, 117, 0.5)";
  }

  // Create view button
  const viewButton = document.createElement('button');
  viewButton.innerHTML = 'view';
  viewButton.className = 'view-button';
  li.appendChild(viewButton);

  // Create edit icon
  let edit = document.createElement('i');
  edit.className = 'fas fa-edit'; // This is a Font Awesome edit icon
  li.appendChild(edit);

  // Create delete button
  let span = document.createElement("span");
  span.innerHTML = "X";
  li.appendChild(span);
  listContainer.appendChild(li);
  resetForm();
}

// Function to reset the task input form
function resetForm() {
  textInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  priorInput.value = '';
  
}

// Event listener for task list container
listContainer.addEventListener("click", (e) => {
  if (e.target.tagName == "LI") {
    // Toggle task completion status
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName == "SPAN") {
    // Delete a task
    const confirmation = confirm('Do you really want to remove the task?');
    if (confirmation) {
      e.target.parentElement.remove();
      alert('Task successfully deleted!');
      saveData();
    }
  } else if (e.target.tagName === "I") {
    // Edit a task
    const li = e.target.parentElement;
    const taskData = {
      text: li.innerText.split("viewX"),
      date: li.querySelector(".detailsDrop").innerText.split(" | ")[0],
      time: li.querySelector(".detailsDrop").innerText.split(" | ")[1],
      priority: li.querySelector(".detailsDrop").innerText.split(" | ")[2]
    };
    textInput.value = taskData.text;
    dateInput.value = taskData.date;
    timeInput.value = taskData.time;
    priorInput.value = taskData.priority;
    openForm();
    li.remove();
    saveData();
  } else if (e.target.tagName === "BUTTON") {
    // Show/hide task details
    const li = e.target.closest("li");
    if (li) {
      const detailsDiv = li.querySelector(".detailsDrop");
      if (detailsDiv) {
        detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
      }
    }
  }
});

// Function to accept task data and add it to the task list
function acceptData() {
  let taskData = {
    text: textInput.value,
    date: dateInput.value,
    time: timeInput.value,
    priority: priorInput.value
  };
  storeData.push(taskData);
  storeData.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));
  saveData();
  createTask(taskData); // Call the createTask function with the data
  console.log(storeData);
}

// Function to reset and remove all tasks
function resetAll() {
  const confirmation = confirm('Do you really want to remove all the tasks?');
  if (confirmation) {
    resetForm();
    localStorage.clear();
    window.location.reload();
    alert('Successfully deleted all the tasks!');
    saveData();
  }
}

// Function to save task list data to local storage
function saveData() {
  localStorage.setItem("data", JSON.stringify(storeData));
}

// Function to load and display task list data from local storage
function showTask() {
  let storedData = localStorage.getItem("data");
  if (storedData) {
    storeData = JSON.parse(storedData);
    recreateTaskList();
  }
}

// Function to recreate task list based on stored data
function recreateTaskList() {
  listContainer.innerHTML = "";
  for (const taskData of storeData) {
    createTask(taskData);
  }
}

showTask(); // Load and display task list data when the page loads








