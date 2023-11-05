// Get references to task form HTML elements
let form = document.getElementById("popupForm");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let timeInput = document.getElementById("timeInput");
let priorInput = document.getElementById("taskPriority");
let listContainer = document.getElementById("listContainer");
//get references to editForm HTML elements
let editForm=document.getElementById("editPopupForm");
let editTextInput = document.getElementById("editTextInput");
let editDateInput = document.getElementById("editDateInput");
let editTimeInput = document.getElementById("editTimeInput");
let editPriorInput = document.getElementById("editTaskPriority");
let editButton=document.getElementById('edit');
//array that takes data each time when user press save button
let storeData = [];
// Function to display a new task and add it to the task list
function displayTask(taskData) {
  const li = document.createElement("li");
  li.innerHTML = taskData.text;
  li.id=taskData.id;

  let detail = document.createElement("div");
  detail.className = 'detailsDrop';
  detail.id = 'dropDetail';
  detail.innerHTML= `Due: ${taskData.date} | ${taskData.time} | ${taskData.priority}`;
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
  viewButton.className='view-button';
  viewButton.innerHTML='<i class="fa fa-eye"></i>';
  li.appendChild(viewButton);

  // Create edit icon
  let edit = document.createElement('i');
  edit.className = 'fas fa-edit'; // This is a Font Awesome edit icon
  li.appendChild(edit);

  // Create delete button
  let span = document.createElement("span");
  span.className = "fas fa-trash-alt";
  span.id='delete';
  li.appendChild(span);
  listContainer.appendChild(li);
  resetForm();
}

// Event listener for task list container
listContainer.addEventListener("click", (e) => {
  if (e.target.tagName == "LI") {
    // Toggle task completion status
    const li=e.target;
    li.classList.toggle("checked");
    console.log(li.id)
    const taskId=li.id;
    const taskData=storeData.find((task)=>taskId==task.id);
    const taskIndex=storeData.findIndex((task)=>taskId==task.id);
    console.log(`index:${taskIndex}`)
    taskData.status=li.classList.contains("checked")?"completed":"not completed";
    console.log(taskData);
    storeData[taskIndex]=taskData;
    saveData();
  }else if(e.target.tagName == "SPAN") {
    // Delete a task
    const li=e.target;
    const taskId=li.parentElement.id;
    console.log(taskId);
    const taskData=storeData.find((task)=>taskId==task.id);
    const taskIndex=storeData.findIndex((task)=>taskId==task.id);
    console.log(taskIndex);
    console.log(taskData);
    const confirmation = confirm('Do you really want to remove the task?');
    if (confirmation ) {
      li.parentElement.remove();
      storeData.splice(taskIndex,1);
      alert('Task successfully deleted!'); 
      //update data in local storage
      saveData();
    }
  }else if (e.target.tagName === "I") {
    // Edit a task
    const li = e.target.parentElement;
    const taskId = li.id;
    const taskData = storeData.find((task) =>taskId==task.id);
    console.log(taskData);
      editTextInput.value = taskData.text;
      editDateInput.value = taskData.date;
      editTimeInput.value = taskData.time;
      editPriorInput.value = taskData.priority;
      openEditForm();
      editButton.addEventListener("click", () => {
        if(editTextInput.value!="" || editDateInput.value!="" || editTimeInput!=""){
          updateTask(taskId); // Call the function to update the task
          closeEditForm();
          resetEditForm();
        }
    });
    
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
  }}
//to display edited value if edit button clicked

// Function to reset the task input form
function resetForm() {
  textInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
  priorInput.value = '';
  
}
//function to generate id for each task
function generateUniqueId(){
   return Date.now();
}

// Function to accept task data and add it to the task list
function acceptData() {
  
    let taskData = {
    id:generateUniqueId(),
    text: textInput.value,
    date: dateInput.value,
    time: timeInput.value,
    priority: priorInput.value,
    status:"not completed"
  };
  storeData.push(taskData);
  storeData.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));
  window.location.reload();
  saveData();
  displayTask(taskData);
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
//editing task values

function closeEditForm(){
 editForm.style.display="none";
}
function openEditForm(){
  editForm.style.display="block";
}
function resetEditForm(){
  editTextInput.value='';
  editDateInput.value='';
  editTimeInput.value='';
  editPriorInput.value='';
}
function updateTask(taskId) {
  const taskData = storeData.find((task) => taskId == task.id);
  const taskIndex = storeData.findIndex((task) => taskId == task.id);

  taskData.text = editTextInput.value;
  taskData.date = editDateInput.value;
  taskData.time = editTimeInput.value;
  taskData.priority = editPriorInput.value;

  storeData[taskIndex] = taskData;
  saveData();
  const liToUpdate = document.getElementById(taskId);

  // Update the task's text
  liToUpdate.innerHTML = taskData.text;

  // Update the task details
  let detail = document.createElement("div");
  detail.className = 'detailsDrop';
  detail.id = 'dropDetail';
  detail.innerHTML= `Due: ${taskData.date} | ${taskData.time} | ${taskData.priority}`;
  liToUpdate.appendChild(detail);
  // Update the task's priority-specific styles
  liToUpdate.style.backgroundColor = taskData.priority === 'High'? "rgba(248, 123, 165, 0.5)": taskData.priority === 'Medium'? "rgba(217, 128, 244, 0.5)": "rgba(243, 228, 117, 0.5)";

  // Re-add the view button
  const viewButton = document.createElement('button');
  viewButton.className = 'view-button';
  viewButton.innerHTML = '<i class="fa fa-eye"></i>';
  liToUpdate.appendChild(viewButton);

  // Re-add the edit icon
  const editIcon = document.createElement('i');
  editIcon.className = 'fas fa-edit';
  liToUpdate.appendChild(editIcon);

  // Re-add the delete button
  const deleteButton = document.createElement('span');
  deleteButton.className = 'fas fa-trash-alt';
  liToUpdate.appendChild(deleteButton);
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

    displayTask(taskData);
  }
}

showTask(); // Load and display task list data when the page loads