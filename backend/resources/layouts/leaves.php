<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require __DIR__ . '/../../app/Controllers/LeaveController.php';

$leaveController = new LeaveController($pdo);

$leaves = $leaveController->fetchAllLeaves();

echo json_encode($leaves[0]);