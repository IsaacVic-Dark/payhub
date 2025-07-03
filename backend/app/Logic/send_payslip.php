<?php
date_default_timezone_set('Africa/Nairobi');

$day = date('j');
$time = date('H:i'); 

if ($day == 9 && $time == '08:00') {

    $id = 1;

    

    // Load necessary files and DB connection
    require_once 'generate_payslip.php';

    // Send payslips to all employees
    sendAllPayslips(); 
}
?>
