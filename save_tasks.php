<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $completedTasks = $data['completed'];
    $allTasks = file('tasks.txt', FILE_IGNORE_NEW_LINES);

    // Save completed tasks to completed.txt
    file_put_contents('completed.txt', implode("\n", $completedTasks) . "\n", FILE_APPEND);

    // Remove completed tasks from tasks.txt
    $remainingTasks = array_diff($allTasks, $completedTasks);
    file_put_contents('tasks.txt', implode("\n", $remainingTasks) . "\n");

    echo "Tasks updated successfully.";
}
?>
