const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        const { completed } = JSON.parse(event.body);
        const tasksFile = process.env.TASKS_FILE_PATH || path.resolve(__dirname, '../../tasks.txt');
        const completedFile = process.env.COMPLETED_FILE_PATH || path.resolve(__dirname, '../../completed.txt');

        const allTasks = fs.readFileSync(tasksFile, 'utf-8').split('\n').filter(task => task.trim() !== '');
        const remainingTasks = allTasks.filter(task => !completed.includes(task));

        fs.writeFileSync(completedFile, completed.join('\n') + '\n', { flag: 'a' });
        fs.writeFileSync(tasksFile, remainingTasks.join('\n') + '\n');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Tasks updated successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save tasks' })
        };
    }
};

