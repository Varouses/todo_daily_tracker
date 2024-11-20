document.addEventListener('DOMContentLoaded', () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    async function sendTaskToBot(taskText, taskTime) {
        const botToken = "7838203442:AAG6xvqqZaxn9cvRrPlhWn33lduMS1z-qtY"; // Укажите токен вашего бота
        const tg = window.Telegram.WebApp; // Telegram WebApp API
        const chatId = tg.initDataUnsafe.user.id; // ID пользователя Telegram
        const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const message = `/add_task "${taskText}" "${taskTime}"`;

        try {
            console.log("Отправляем запрос:");
            console.log("API URL:", apiUrl);
            console.log("Chat ID:", chatId);
            console.log("Message:", message);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(
                    `Ошибка при отправке данных боту: ${errorDetails.description}`
                );
            }

            console.log("Задача успешно отправлена боту.");
        } catch (error) {
            console.error("Ошибка при отправке задачи боту:", error);
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

            // Локально сохраняем задачу (если нужно)
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
