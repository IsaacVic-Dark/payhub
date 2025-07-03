<?php
require_once __DIR__ . '../../../middleware/check_auth.php';

require __DIR__ . '../../../db/db.php';
require __DIR__ . '../../../modules/employees/controller.php';

include __DIR__ . '../../components/nav.php';

$employeeController = new EmployeeController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] == 'edit') {
    $employeeDetail = [
        'FirstName' => $_POST['FirstName'],
        'LastName' => $_POST['LastName'],
        'Email' => $_POST['Email'],
        'Phone' => $_POST['Phone'],
        'HireDate' => $_POST['HireDate'],
        'JobTitle' => $_POST['JobTitle'],
        'Department' => $_POST['Department'],
        'Salary' => $_POST['Salary'],
        'BankAccountNumber' => $_POST['BankAccountNumber'],
        'TaxID' => $_POST['TaxID'],
        'EmployeeID' => $_POST['EmployeeID'] 
    ];

    $employeeController->updateEmployee($pdo, $_POST['EmployeeID'], $employeeDetail);
    header("Location: employees.php");
    exit();
}

if (isset($_GET['id'])) {
    $employeeID = $_GET['id'];
    $employee = $employeeController->fetchEmployeeById($pdo, $employeeID);
} else {
    echo "No employee ID provided.";
    exit();
}

?>

<h1>Edit employee</h1>

<form action="edit_employee.php" method="POST">
    <input type="hidden" name="EmployeeID" value="<?= htmlspecialchars($employee['EmployeeID']) ?>"><br>
    <input type="text" name="FirstName" value="<?= htmlspecialchars($employee['FirstName']) ?>"><br>
    <input type="text" name="LastName" value="<?= htmlspecialchars($employee['LastName']) ?>"><br>
    <input type="email" name="Email" value="<?= htmlspecialchars($employee['Email']) ?>"><br>
    <input type="text" name="Phone" value="<?= htmlspecialchars($employee['Phone']) ?>"><br>
    <input type="date" name="HireDate" value="<?= htmlspecialchars($employee['HireDate']) ?>"><br>
    <input type="text" name="JobTitle" value="<?= htmlspecialchars($employee['JobTitle']) ?>"><br>
    <input type="text" name="Department" value="<?= htmlspecialchars($employee['Department']) ?>"><br>
    <input type="number" step="0.01" name="Salary" value="<?= htmlspecialchars($employee['Salary']) ?>"><br>
    <input type="text" name="BankAccountNumber" value="<?= htmlspecialchars($employee['BankAccountNumber']) ?>"><br>
    <input type="text" name="TaxID" value="<?= htmlspecialchars($employee['TaxID']) ?>"><br>

    <button type="submit" name="action" value="edit">Edit</button>
</form>