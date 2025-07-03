<?php

require_once __DIR__ . "/../../database/db.php";
require_once __DIR__ . "/../Logic/tax.php";


class DeductionController
{
    public $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Post all deductions
    public function postDeductions($params)
    {
        $id = $params['id'];
        $base_salary = $params['salary'];

        $deductions = calculateNetPay($base_salary);


        $stmt = $this->pdo->prepare("INSERT INTO Deductions (EmployeeID, DeductionType, Amount, DeductionDate) 
                           VALUES (:employeeId, :deductionType, :amount, :deductionDate)");

        $stmt->execute([
            ':employeeId' => $deductions,
            ':deductionType' => $deductionType,
            ':amount' => $amount,
            ':deductionDate' => $deductionDate
        ]);

        return [
            'taxPerc' => number_format($taxPerc),
            'payePerc' => number_format($payePerc),
            'netPayPerc' => number_format($netPayPerc),
            'basicPay' => number_format($basicSalary),
            'nssf' => number_format($nssf),
            'shif' => number_format($shif),
            'housingLevy' => number_format($housingLevy),
            'taxableIncome' => number_format($taxableIncome),
            'taxBeforeRelief' => number_format($tax),
            'personalRelief' => number_format(PERSONAL_RELIEF),
            'paye' => number_format($paye),
            'netPay' => number_format(floor($netPay * 100 - 0.0001) / 100, 2, '.', ',')
        ];
    }

    // Fetch all deductions
    public function fetchAllDeductions()
    {
        $sql = "SELECT * FROM Deductions";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
