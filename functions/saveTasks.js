const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    console.log('Function triggered');
    if (event.httpMethod === 'POST') {
        try {
            const data = JSON.parse(event.body);
            console.log('Data received:', data);
            const completedTasks = data.completed;

            const tasksPath = path.resolve(__dirname, '../../tasks.txt');
            const completedPath = path.resolve(__dirname, '../../completed.txt');

            console.log('Paths:', tasksPath, completedPath);

            const allTasks = fs.readFileSync(tasksPath, 'utf-8').split('\n').filter(task => task.trim() !== '');
            console.log('All tasks:', allTasks);

            // Save completed tasks to completed.txt
            fs.appendFileSync(completedPath, completedTasks.join('\n') + '\n');
            console.log('Completed tasks saved');

            // Remove completed tasks from tasks.txt
            const remainingTasks = allTasks.filter(task => !completedTasks.includes(task));
            fs.writeFileSync(tasksPath, remainingTasks.join('\n') + '\n');
            console.log('Remaining tasks saved');

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, error: error.message })
            };
        }
    } else {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }
};
