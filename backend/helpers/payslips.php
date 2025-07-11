<?php

require __DIR__ . '../../db/db.php';
require_once __DIR__ . '../../vendor/autoload.php'; 
require_once __DIR__ . '../../modules/employees/controller.php'; 

date_default_timezone_set('Africa/Nairobi');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$companyName = $_ENV['COMPANY_NAME'];
$companyAdd = $_ENV['COMPANY_ADDRESS'];
$companyEmail = $_ENV['COMPANY_EMAIL'];
$companyPhone = $_ENV['COMPANY_PHONE'];
$payType = $_ENV['PAY_TYPE'];


$id = $_POST['id'];
$employeeDetail = fetchEmployeeById($pdo, $id);

$name = "{$employeeDetail['FirstName']}.{$employeeDetail['LastName']}";

if(date('j') == 9 ){    
    $pay_date = date('l jS \of F Y h:i:s A', strtotime('+1 day'));
    $previous_pay_day = date('j/n/Y', strtotime('+1 day -1 month')); 
}

// Create new PDF document
$pdf = new TCPDF();
$pdf->SetCreator('Payroll System');
$pdf->SetAuthor('Your Company');
$pdf->SetTitle('Payslip');

// Add a page
$pdf->AddPage();

// Payslip content (customize as needed)
ob_start();
include __DIR__ . '/../templates/payslip_template.php';
$html = ob_get_clean();

// Output HTML content
$pdf->writeHTML($html, true, false, true, false, '');

// Save PDF to a file (optional)
$pdfPath = __DIR__ . "../../payslips/payslip_{$employee['id']}.pdf";
$pdf->Output($pdfPath, 'F'); 

// For download in browser:
$pdf->Output("Payslip_{$employee['id']}.pdf", 'D'); // 'D' = force download
?>

<h1>Generate a payslip</h1>