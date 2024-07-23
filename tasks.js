document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    fetch('tasks.txt')
        .then(response => response.text())
        .then(data => {
            const tasks = data.split('\n').filter(task => task.trim() !== '');
            const taskList = document.getElementById('taskList');
            tasks.forEach(task => {
                const listItem = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = task;
                listItem.appendChild(checkbox);
                listItem.appendChild(document.createTextNode(task));
                taskList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading tasks:', error));
}

function saveCompletedTasks() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const completedTasks = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (completedTasks.length > 0) {
        fetch('/.netlify/functions/saveTasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: completedTasks })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Completed tasks saved.');
                location.reload();
            } else {
                alert('Error saving tasks.');
            }
        })
        .catch(error => console.error('Error saving tasks:', error));
    } else {
        alert('No tasks selected.');
    }
}
