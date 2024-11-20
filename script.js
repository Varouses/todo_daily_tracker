document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskTime = document.getElementById('taskTime');
        const taskText = taskInput.value.trim();
        const taskNotifyTime = taskTime.value;

        if (taskText) {
            tasks.push({ text: taskText, time: taskNotifyTime, done: false });
            taskInput.value = '';
            taskTime.value = '';
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
                    ${task.text} <small>${task.time || ''}</small>
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

    window.addTask = addTask;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
});
