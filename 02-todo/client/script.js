todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));

todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));
todoForm.addEventListener('submit', onSubmit);
const todoListElement = document.getElementById('todoList');
let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;
const api = new Api('http://localhost:5000/tasks');


function validateField(field) {
  /* Destructuring används för att plocka ut endast egenskaperna name och value ur en rad andra egenskaper som field har. Mer om destructuring https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment */

  /* Name är det name-attribut som finns på HTML-taggen. title i detta exempel: <input type="text" id="title" name="title" /> 
  value är innehållet i fältet, dvs. det någon skrivit. */
  const { name, value } = field;

  /* Sätter en variabel som framöver ska hålla ett valideringsmeddelande */
  let = validationMessage = '';
  
  switch (name) {
    /* Så de olika fallen - case - beror på vilket name-attribut som finns på det elementet som skickades till validateField - alltså vilket fält som någon skrev i eller lämnade. */

    /* Fallet om någon skrev i eller lämnade fältet med name "title" */
    case 'title': {
      /* Då görs en enkel validering på om värdet i title-fältet är kortare än 2 */
      if (value.length < 2) {
        /* Om det inte är två tecken långt kommer man in i denna if-sats och titleValid variabeln sätts till false, validationMessage sätts till ett lämpligt meddelande som förklarar vad som är fel.  */
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        /* Validering görs också för att kontrollera att texten i fältet inte har fler än 100 tecken. */
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        /* Om ingen av dessa if-satser körs betyder det att fältet är korrekt ifyllt. */
        titleValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "description" */
    case 'description': {
      /* Liknande enkla validering som hos title */
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    /* Fallet om någon skrev i eller lämnade fältet med name "dueDate" */
    case 'dueDate': {
      /* Här är valideringen att man kollar om något alls har angetts i fältet. dueDate är obligatoriskt därför måste det vara mer än 0 tecken i fältet */
      if (value.length === 0) {
        /* I videon för lektion 6 är nedanstående rad fel, det står där descriptionValid =  false;, men ska förstås vara dueDateValid = false; */
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;
  
  field.previousElementSibling.classList.remove('hidden');
}

/* Callbackfunktion som används för eventlyssnare när någon klickar på knappen av typen submit */
function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');

    saveTask();
  }
}
function saveTask() {
    const task = {
      title: todoForm.title.value,
      description: todoForm.description.value,
      dueDate: todoForm.dueDate.value,
      completed: false
    };
   
  
    api.create(task).then((task) => {
     
      if (task) {
        renderList();
      }
    });
  }
  
  function renderList() {
   
    console.log('rendering');
    api.getAll().then((tasks) => {
      
      todoListElement.innerHTML = '';
  
      
      if (tasks && tasks.length > 0) {
        
        tasks.forEach((task) => {
          
  
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        });
      }
    });
  }
  
  
  function renderTask({ id, title, description, dueDate }) {
    
    let html = `
      <li class="select-none mt-2 py-2 border-b border-amber-300">
        <div class="flex items-center">
          <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase">${title}</h3>
          <div>
            <span>${dueDate}</span>
            <button onclick="deleteTask(${id})" class="inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
          </div>
        </div>`;
  
    description &&
      
      (html += `
        <p class="ml-8 mt-2 text-xs italic">${description}</p>
    `);
  
    html += `
      </li>`;
    
    return html;
  }
  
  function deleteTask(id) {
    
  
    
    api.remove(id).then((result) => {
      
  
      renderList();
      
    });
  }
  
  function addTask() {
    const task = {
      title: todoForm.title.value,
      description: todoForm.description.value,
      dueDate: todoForm.dueDate.value,
      completed: false
    };
  
    api.create(task).then((task) => {
      if (task) {
        renderList();
      }
    });
  }
  //organizing the tasks when it marked ass done and when they are not done
  function organizeTodoLists(tasks) {
    let list = tasks.filter((task) => !task.completed); 
    let completed = tasks.filter((task) => task.completed); 
    list.sort(sortByDate); 
    completed.sort(sortByDate); 
    list = list.concat(completed); 
    return list; 
  }
  renderList();