<?php
require_once __DIR__ . '/../../app/Middleware/check_auth.php';

echo "<h2>Employee Profile</h2>";

// require __DIR__ . '../../../modules/employees/controller.php';
require __DIR__ . '../../../app/Controllers/EmployeeController.php';
require __DIR__ . '../../../app/Controllers/LeaveController.php';
require __DIR__ . '../../../app/Logic/tax.php';
// require __DIR__ . '../../../modules/deductions/tax.php';

include __DIR__ . '../../components/nav.php';

$employeeController = new EmployeeController($pdo);

$employee = $employeeController->fetchEmployeeById($pdo, $_GET['id']);

$deductions = calculateNetPay(basicSalary: $employee['Salary']);

$employeeId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$leaves = getEmployeeLeaves($pdo, $employeeId);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['leave_id'])) {
    $leaveId = (int)$_POST['leave_id'];
    $status = $_POST['action']; 

    alterLeaves($pdo, $leaveId, $status);

    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}

echo "<p><strong>Name:</strong> " . htmlspecialchars($employee['FirstName']) . "</p>";
echo "<p><strong>Job Title:</strong> " . htmlspecialchars($employee['JobTitle']) . "</p>";
echo "<p><strong>Department:</strong> " . htmlspecialchars($employee['Department']) . "</p>";
echo "<p><strong>Basic Pay:</strong> " . htmlspecialchars($employee['Salary']) . "</p>";
echo "<p><strong>Email:</strong> " . htmlspecialchars($employee['Email']) . "</p>";
echo "<p><strong>Phone:</strong> " . htmlspecialchars($employee['Phone']) . "</p>";
echo "<p><strong>HireDate:</strong> " . htmlspecialchars($employee['HireDate']) . "</p>";
echo "<p><strong>BankAccountNumber:</strong> " . htmlspecialchars($employee['BankAccountNumber']) . "</p>";

echo "<h2>Deductions</h2>";
echo "<p><strong>NSSF:</strong> " . $deductions['nssf'] . "</p>";
echo "<p><strong>SHIF:</strong> " . $deductions['shif'] . "</p>";
echo "<p><strong>Housing Levy:</strong> " . $deductions['housingLevy'] . "</p>";
echo "<p><strong>Taxable Pay:</strong> " . $deductions['taxableIncome'] . "</p>";
echo "<p><strong>Income Tax:</strong> " . $deductions['taxBeforeRelief'] . "</p>";
echo "<p><strong>Personal Relief:</strong> " . $deductions['personalRelief'] . "</p>";
echo "<p><strong>PAYE:</strong> " . $deductions['paye'] . "</p>";
echo "<p><strong>Net Pay:</strong> " . $deductions['netPay'] . "</p>";

?>

<h3>Leave Applications</h3>

<?php if (!empty($leaves)): ?>
    <ul>
        <?php foreach ($leaves as $leave): ?>
            <li>
                Type: <?= htmlspecialchars($leave['LeaveType']) ?> |
                Start date: <?= htmlspecialchars($leave['StartDate']) ?> |
                End date: <?= htmlspecialchars($leave['EndDate']) ?> |
                Status: <?= htmlspecialchars($leave['Status']) ?> 

                <form action="" method="POST" style="display:inline;">
                    <input type="hidden" name="leave_id" value="<?= htmlspecialchars($leave['LeaveID']) ?>">
                    <button type="submit" name="action" value="Approved">Approve</button>
                    <button type="submit" name="action" value="Rejected">Reject</button>
                </form>
            </li>
        <?php endforeach; ?>
    </ul>
<?php else: ?>
    <p>No leave applications found for this employee.</p>
<?php endif; ?>

