<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require __DIR__ . '/../../app/Controllers/EmployeeController.php';

$employeeController = new EmployeeController($pdo);
$data = $employeeController->fetchAllEmployees($pdo);

// Part of react
echo json_encode($data);
// End of react

