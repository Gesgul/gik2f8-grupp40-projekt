todoForm.title.addEventListener("keyup", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));

todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById("todoList");

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api("http://localhost:5000/tasks");

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = "";
  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case "dueDate": {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove("hidden");
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log("Submit");

    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false,
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log("rendering");

  api.getAll().then((tasks) => {
    todoListElement.innerHTML = "";

    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
        var taskItem = document.getElementById(`task-${task.id}`);
        var checkbox = document.getElementById(`checkbox-${task.id}`);
        if (task.completed) {
          taskItem.style.backgroundColor = "Green";
        } else {
          taskItem.style.backgroundColor = "Inherit";
        }
        checkbox.checked = task.completed;
      });
    }
  });
}

function renderTask(task) {
  const JSONData = JSON.stringify(task);
  let html = `
    <li id="task-${task.id}" class="select-none mt-2 py-2 border-b border-amber-300">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${task.title}</h3>
        <div>
          <span>${task.dueDate}</span>
          <button onclick="deleteTask(${task.id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;

  /**/
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic ">${task.description}</p>
      <div class="flex items-center pl-4">
    <input id="checkbox-${task.id}" onclick='checkboxstate(this,${JSONData})' type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label for="-checkbox" class="py-4 ml-2 w-full text-1 font-bold text-blue-800 italic ">klar</label>
    </div>
    
  `);

  html += `
    </li>`;

  return html;
}

function checkboxstate(checkbox, task) {
  var taskItem = document.getElementById(`task-${task.id}`);
  if (checkbox.checked) {
    taskItem.style.backgroundColor = "Green";
  } else {
    taskItem.style.backgroundColor = "Inherit";
  }
  task.completed = checkbox.checked;
  updateTask(task);
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

function updateTask(data) {
  api.update(data).then((result) => {});
}
renderList();