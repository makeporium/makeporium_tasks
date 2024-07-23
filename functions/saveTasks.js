const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { completed } = JSON.parse(event.body);
            const tasksFilePath = path.resolve('./public/tasks.txt');
            const completedFilePath = path.resolve('./public/completed.txt');

            if (!fs.existsSync(tasksFilePath)) {
                throw new Error('Tasks file not found');
            }

            const allTasks = fs.readFileSync(tasksFilePath, 'utf8').split('\n').filter(task => task.trim() !== '');
            
            // Append completed tasks to completed.txt
            fs.appendFileSync(completedFilePath, completed.join('\n') + '\n');

            // Remove completed tasks from tasks.txt
            const remainingTasks = allTasks.filter(task => !completed.includes(task));
            fs.writeFileSync(tasksFilePath, remainingTasks.join('\n') + '\n');

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Tasks updated successfully.' }),
            };
        } catch (error) {
            console.error('Error processing tasks:', error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal server error.', error: error.message }),
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed.' }),
        };
    }
};
