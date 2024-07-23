const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    if (event.httpMethod === 'POST') {
        const data = JSON.parse(event.body);
        const completedTasks = data.completed;

        const tasksPath = path.resolve(__dirname, '../../tasks.txt');
        const completedPath = path.resolve(__dirname, '../../completed.txt');

        const allTasks = fs.readFileSync(tasksPath, 'utf-8').split('\n').filter(task => task.trim() !== '');

        // Save completed tasks to completed.txt
        fs.appendFileSync(completedPath, completedTasks.join('\n') + '\n');

        // Remove completed tasks from tasks.txt
        const remainingTasks = allTasks.filter(task => !completedTasks.includes(task));
        fs.writeFileSync(tasksPath, remainingTasks.join('\n') + '\n');

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } else {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }
};
