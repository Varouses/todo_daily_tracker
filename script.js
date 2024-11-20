const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText) {
        tasks.push({ text: taskText, done: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks
        .map(
            (task, index) => `
            <li class="${task.done ? 'done' : ''}">
                ${task.text}
                <span>
                    <button onclick="toggleTask(${index})">✔</button>
                    <button onclick="deleteTask(${index})">❌</button>
                </span>
            </li>
        `
        )
        .join('');
}

renderTasks();

const tg = window.Telegram.WebApp;
tg.ready();
document.body.insertAdjacentHTML(
    'afterbegin',
    `<h2>Привет, ${tg.initDataUnsafe.user.first_name || 'пользователь'}!</h2>`
);
