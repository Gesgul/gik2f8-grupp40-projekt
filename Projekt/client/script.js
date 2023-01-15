WinnersForm.playerNamn.addEventListener("keyup", (e) => validateField(e.target));
WinnersForm.playerNamn.addEventListener("blur", (e) => validateField(e.target));
WinnersForm.lag.addEventListener("keyup", (e) => validateField(e.target));
WinnersForm.lag.addEventListener("blur", (e) => validateField(e.target));

WinnersForm.dueDate.addEventListener("input", (e) => validateField(e.target));
WinnersForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

WinnersForm.addEventListener("submit", onSubmit);

const WinnersListElement = document.getElementById("WinnersList");

let playerNamnValid = true;
let lagValid = true;
let dueDateValid = true;

const api = new Api("http://localhost:5000/tasks");

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = "";
  switch (name) {
    case "playerNamn": {
      if (value.length < 2) {
        playerNamnValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        playerNamnValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        playerNamnValid = true;
      }
      break;
    }
    case "lag": {
      if (value.length > 500) {
        lagValid = false;
        validationMessage =
          "Fältet 'lag' får inte innehålla mer än 500 tecken.";
      } else {
        lagValid = true;
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
  if (playerNamnValid && lagValid && dueDateValid) {
    console.log("Submit");

    saveTask();
  }
}

function saveTask() {
  const task = {
    playerNamn: WinnersForm.playerNamn.value,
    lag: WinnersForm.lag.value,
    dueDate: WinnersForm.dueDate.value,
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
  WinnersListElement.innerHTML = "";

  if (tasks && tasks.length > 0) {
    tasks.forEach((task) => {
      WinnersListElement.insertAdjacentHTML("beforeend", renderTask(task));
    });
  }
});
}

function renderTask(task) {
  let html = `
    <li id="task-${task.id}">
      <div>Namn
        <h2 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${task.playerNamn}</h3>
        <div>
          <span>Lag: <h2 class="mb-3 flex-1 text-xl font-bold text-black-800 uppercase">${task.lag}</h3></span>
        </div>
        <div>
          <span>År: <br>
          ${task.dueDate}</span><br>
          <button onclick="deleteTask(${task.id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md">Delete</button>
        </div>
      </div>
    </li>
  `;

  return html;
}




function deleteTask(id) {
  api.remove(id).then(() => {
    renderList();
  });
}


renderList();
