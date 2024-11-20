document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    async function sendTaskToBot(taskText, taskTime) {
        const apiUrl = "http://127.0.0.1:5000/add_task"; // URL API сервера
        const tg = window.Telegram.WebApp; // Telegram WebApp API
        const chatId = tg.initDataUnsafe.user.id; // ID пользователя Telegram

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    task_text: taskText,
                    task_time: taskTime,
                }),
            });

            if (!response.ok) {
                throw new Error("Ошибка при отправке задачи боту.");
            }

            console.log("Задача успешно отправлена боту через API.");
        } catch (error) {
            console.error("Ошибка при отправке задачи:", error);
        }
    }

    async function addTask() {
        const taskInput = document.getElementById("taskInput");
        const taskTime = document.getElementById("taskTime");
        const taskText = taskInput.value.trim();
        const taskNotifyTime = taskTime.value;

        if (taskText && taskNotifyTime) {
            // Отправляем задачу боту
            await sendTaskToBot(taskText, taskNotifyTime);

            // Локально сохраняем задачу
            tasks.push({ text: taskText, time: taskNotifyTime, done: false });
            taskInput.value = "";
            taskTime.value = "";
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
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = tasks
            .map(
                (task, index) => `
                <li class="${task.done ? "done" : ""}">
                    ${task.text} <small>${task.time || ""}</small>
                    <span>
                        <button onclick="toggleTask(${index})">✔</button>
                        <button onclick="deleteTask(${index})">❌</button>
                    </span>
                </li>
            `
            )
            .join("");
    }

    renderTasks();

    window.addTask = addTask;
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
});
