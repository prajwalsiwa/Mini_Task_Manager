const baseUrl = 'http://127.0.0.1:80'

let currentIndex = 0;

const sliderImages = document.querySelectorAll('.slider_image');

function showSlide(index) {
    sliderImages.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
            img.classList.add('active');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % sliderImages.length;
    showSlide(currentIndex);
}

setInterval(nextSlide, 3000);


function fetchTasks() {
    const endPoint = baseUrl + '/get_tasks.php' 
    fetch(endPoint)
        .then(response => response.json())
        .then(tasks => {
            renderTasks(tasks);
        })
        .catch(error => console.error('Error fetching tasks:', error));
}


function renderTasks(tasks) {
    const taskCard = document.getElementById('taskCard');
    const taskList = tasks.map(task => {
        return `
            <div class="task-item" id="task-${task.id}">
                <input type="checkbox" id="task-${task.id}-checkbox" ${task.is_completed ? 'checked' : ''} onchange="toggleTaskStatus(${task.id}, this)">
                <label for="task-${task.id}-checkbox">${task.task_name}</label>
                <button class="delete-btn" onclick="deleteTask(${task.id})">X Delete</button>
            </div>
        `;
    }).join('');
    
    taskCard.innerHTML = taskList + `
        <input type="text" class="new-task-input" id="newTaskInput" placeholder="Add new task">
        <button class="add-task-btn" onclick="addTask()">Add Task</button>
    `;
}


window.onload = fetchTasks;

function addTask() {
    const endPoint = baseUrl + '/add_task.php' 
    
    const newTaskInput = document.getElementById('newTaskInput');
    const newTaskName = newTaskInput.value.trim();

    if (newTaskName === '') return; 
    fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task_name=${newTaskName}`,
    })
    .then(response => response.text())
    .then(() => {
        newTaskInput.value = ''; 
        fetchTasks();
    })
    .catch(error => console.error('Error adding task:', error));
}

function toggleTaskStatus(taskId, checkbox) {
    const endPoint = baseUrl + '/update_task_status.php' 
    const isCompleted = checkbox.checked;
    
    fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task_id=${taskId}&is_completed=${isCompleted}`,
    })
    .then(response => response.text())
    .then(() => fetchTasks())  
    .catch(error => console.error('Error updating task status:', error));
}

function deleteTask(taskId) {
    const endPoint = baseUrl + '/delete_task.php' 
    fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task_id=${taskId}`,
    })
    .then(response => response.text())
    .then(() => fetchTasks())  
    .catch(error => console.error('Error deleting task:', error));
}
