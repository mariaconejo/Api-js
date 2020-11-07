// Lista de tareas (Array).
let tareas = [];

// Se obtiene el listado inicial de tareas a partir del API.
fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=16`)
  .then((response) => response.json())
  .then((data) => {
    tareas = data;

    for (let i = 0; i < tareas.length; i++) {
      appendTaskDOM(tareas[i]);
    }
  });

// addTask(): Agrega una tarea en la lista.
function addTask(nombreTarea, fechaTarea, completoTarea) {
  // Crea un objeto que representa la nueva tarea.
  const nuevaTarea = {
    name: nombreTarea,
    complete: completoTarea,
    date: fechaTarea,
  };

  // Agrega el objeto en el array.
  tareas.push(nuevaTarea);

  // Envía la nueva tarea al API.

  // Opciones para el fetch.
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(nuevaTarea),
  };
  // Ejecuta el fetch.
  fetch(`https://js2-tareas-api.netlify.app/api/tareas?uid=16`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      // Agrega la tarea al DOM.
      appendTaskDOM(data); // eslint-disable-line no-use-before-define
    });
}

// taskStatus(): Actualiza el estado de una tarea.
function taskStatus(id, complete) {

  let task = '';
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto cambia su estado.
    if (tareas[i]._id === id) {
      tareas[i].complete = complete;
      task = tareas[i]
      break;
    }
  }


  const fetchmodify = {
    method: 'PUT',
    body: JSON.stringify(task)
  };

  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=16`, fetchmodify)
  .then((response) => response.json())
  .then((data) => {
  });

}

// deleteTask(): Borra una tarea.
function deleteTask(id) {
  // Recorre la lista de tareas.
  for (let i = 0; i < tareas.length; i++) {
    // Cuando encuentra la tarea con el id correcto la borra.
    if (tareas[i]._id === id) {
      tareas.splice(i, 1);
      break;
    }
  };

  const fetchclear = {
    method : 'DELETE',
  };

  fetch(`https://js2-tareas-api.netlify.app/api/tareas/${id}?uid=16`, fetchclear)
  .then((response) => response.json())
  .then((data) => {
  });
}

//
// Vista.
//

// Lista de tareas (DOM).
const lista = document.getElementById('task-list');

function appendTaskDOM(tarea) {
  // Item de la lista
  const item = document.createElement('li');
  item.className = 'task-list__item';
  // Checkbox.
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', `tarea-${tarea._id}`);
  checkbox.checked = tarea.complete;
  checkbox.dataset.taskId = tarea._id;
  // Label.
  const label = document.createElement('label');
  label.setAttribute('for', `tarea-${tarea._id}`);
  label.innerHTML = `${tarea.name} - ${tarea.date}`;
  // Botón de borrar.
  const buttonDelete = document.createElement('button');
  buttonDelete.className = 'task-list__delete';
  buttonDelete.setAttribute('id', `delete-${tarea._id}`);
  buttonDelete.dataset.taskId = tarea._id;
  buttonDelete.innerHTML = 'Borrar';
  // Se agregan elementos.
  item.appendChild(checkbox);
  item.appendChild(label);
  item.appendChild(buttonDelete);
  lista.appendChild(item);
  // Evento para marcar tareas como completas.
  checkbox.addEventListener('click', (event) => {

    const complete = event.currentTarget.checked;
    const taskId = event.currentTarget.dataset.taskId;
    taskStatus(taskId, complete);
  });
  // Evento para borrar tareas.
  buttonDelete.addEventListener('click', (event) => {
    const taskId = event.currentTarget.dataset.taskId;
    deleteTask(taskId);
    // Borra la tarea en el DOM.
    event.currentTarget.parentNode.remove();
  });
}

//
// Controlador.
//

// Formulario para añadir tareas.
const formulario = document.getElementById('new-task-form');

// Event handler para el evento 'submit' del formulario.
// Crea una nueva tarea.
formulario.addEventListener('submit', (event) => {
  // Se cancela el comportamiento default del formulario.
  event.preventDefault();

  // Agrega el nuevo ítem al modelo.
  addTask(formulario.elements[0].value, formulario.elements[1].value, false);

  // Reseteamos el form.
  formulario.elements[0].value = '';
  formulario.elements[1].value = '';
});
