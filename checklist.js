// Checklist simple en JavaScript puro
(function(){
  const STORAGE_KEY = 'checklistTasks'; // clave para localStorage

  // Elementos del DOM
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('tasks-list');

  // Leer tareas de localStorage o iniciar vacío
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Guardar tareas en localStorage
  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Renderizar la lista en el DOM
  function render(){
    list.innerHTML = '';
    if(tasks.length === 0){
      const li = document.createElement('li');
      li.textContent = 'No hay tareas. Añade una arriba.';
      li.style.color = '#9ca3af';
      list.appendChild(li);
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task' + (task.done ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', ()=> toggleDone(task.id));

      const span = document.createElement('span');
      span.className = 'text';
      span.textContent = task.text;

      const del = document.createElement('button');
      del.className = 'small-btn';
      del.textContent = 'Eliminar';
      del.addEventListener('click', ()=> removeTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(del);

      list.appendChild(li);
    });
  }

  // Añadir nueva tarea (texto no vacío)
  function addTask(text){
    const trimmed = text.trim();
    if(!trimmed) return;
    const task = { id: Date.now().toString(), text: trimmed, done: false };
    tasks.unshift(task); // la más reciente arriba
    save();
    render();
  }

  // Alternar completado por id
  function toggleDone(id){
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    save();
    render();
  }

  // Eliminar tarea por id
  function removeTask(id){
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  // Manejar envío del formulario
  form.addEventListener('submit', function(e){
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  // Inicializar render
  document.addEventListener('DOMContentLoaded', render);
  // También render ahora (en caso de que DOMContentLoaded ya haya ocurrido)
  render();

  // Export breve (opcional para debugging desde consola)
  window.__checklist = { addTask, removeTask, toggleDone };

})();
