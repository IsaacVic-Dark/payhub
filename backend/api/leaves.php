<?php

require_once __DIR__ . '/../../app/Controllers/LeaveController.php';

$leaveController = new LeaveController($pdo);

$leaves = $leaveController->fetchAllLeaves();

echo json_encode($leaves[0]);