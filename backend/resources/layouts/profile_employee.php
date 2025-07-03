<?php

require __DIR__ . '../../../middleware/check_auth.php';

require __DIR__ . '../../../db/db.php';
require __DIR__ . '../../../modules/employees/controller.php';
require __DIR__ . '../../../modules/leave/controller.php';

$id = $_SESSION['user']['UserID'];

include __DIR__ . '../../components/nav.php';

$employeeController = new EmployeeController($pdo);

$employee = $employeeController->fetchEmployeeById($pdo, $id);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'leave') {

        $leaveApplication= [
            "id" => $id,
            "LeaveType" => $_POST['leaveType'],
            "StartDate" => $_POST['StartDate'],
            "EndDate" => $_POST['EndDate'],
            "Status" => $_POST['Status'],
        ];

        applyLeaveByID($pdo, $leaveApplication);

        header("Location: /resources/layouts/profile_employee.php");
        exit();
    }elseif($_POST['action'] === 'edit'){
        header("Location: edit_employee.php?id=$id");
        exit();
    }
}


?>

<h1>Employee page</h1>

<h2>Hi, <?= $employee['FirstName'] ?></h2>
<p><strong>Last Name:</strong> <?= $employee['LastName'] ?></p>
<p><strong>Email:</strong> <?= $employee['Email'] ?></p>
<p><strong>Phone:</strong> <?= $employee['Phone'] ?></p>
<p><strong>Hire Date:</strong> <?= $employee['HireDate'] ?></p>
<p><strong>Job Title:</strong> <?= $employee['JobTitle'] ?></p>
<p><strong>Department:</strong> <?= $employee['Department'] ?></p>
<p><strong>Salary:</strong> <?= number_format($employee['Salary'], 2) ?></p>
<p><strong>Bank Account Number:</strong> <?= $employee['BankAccountNumber'] ?></p>
<p><strong>Tax ID:</strong> <?= $employee['TaxID'] ?></p>

<form action="" method="POST">
    <button type="submit" name="action" value="edit">Edit</button>
    <button type="submit" name="action" value="advance">Salary advance</button>
</form>

<h2>Leave application</h2>
<form action="" method="POST">
    <label for="leaveType">Leave Type:</label>
    <select name="leaveType" id="leaveType">
        <option value="Sick">Sick</option>
        <option value="Casual">Casual</option>
        <option value="Annual">Annual</option>
        <option value="Maternity">Maternity</option>
        <option value="Paternity">Paternity</option>
    </select>
    <label for="StartDate">Start date:</label>
    <input type="date" name="StartDate">
    <label for="EndDate">End date:</label>
    <input type="date" name="EndDate">
    <input type="hidden" name="Status" value="pending">
    <button type="submit" name="action" value="leave">Apply for a leave</button>
</form>

<p><?= htmlspecialchars(checkLeaveStatus($pdo, $id)) ?></p>
