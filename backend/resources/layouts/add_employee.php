<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require __DIR__ . '/../../app/Controllers/EmployeeController.php';

$employeeController = new EmployeeController($pdo);

// Read raw JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check if data was received
if ($data) {
    $EmployeeID = $data['EmployeeID'];
    $FirstName = $data['FirstName'];
    $LastName = $data['LastName'];
    $JobTitle = $data['JobTitle'];
    $Department = $data['Department'];
    $HireDate = $data['HireDate'];
    $Salary = $data['Salary'];
    $Email = $data['Email'];
    $Phone = $data['Phone'];
    $TaxID = $data['TaxID'];

    $employeeController->addEmployee($data);
    
    echo json_encode([
        "status" => "success",
        "message" => "Employee added successfully",
        "data" => $data
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid input"
    ]);
}


// add employee $data

?>
    <input type="text" name="FirstName" placeholder="Enter first name">
    <input type="text" name="LastName" placeholder="Enter last name">
    <input type="tel" name="phone" placeholder="Enter phone number">
    <input type="text" name="jobTitle" placeholder="Enter job title">
    <select name="department" id="department">
        <option value="">-- Select Department --</option>
        <option value="hr">Human Resources</option>
        <option value="finance">Finance</option>
        <option value="it">Information Technology</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Sales</option>
        <option value="operations">Operations</option>
        <option value="legal">Legal</option>
        <option value="procurement">Procurement</option>
        <option value="customer_service">Customer Service</option>
        <option value="research_development">Research & Development</option>
    </select>

    <input type="number" name="salary" placeholder="Enter salary">
    <input type="number" name="bankAccountNumber" placeholder="Enter bank account number">
    <input type="date" name="hireDate" placeholder="Enter hire date">
    <input type="text" name="taxID" placeholder="Enter Tax ID">
    <button type="submit" name="action" value="add">Save employee</button>
</form> -->