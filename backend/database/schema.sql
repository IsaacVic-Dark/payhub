CREATE DATABASE PayrollSystem;
USE PayrollSystem;

-- Users table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    UserType ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pay Run Table for Kenyan Payroll System
CREATE TABLE payruns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payrun_name VARCHAR(100) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_frequency ENUM('weekly', 'bi-weekly', 'monthly') NOT NULL DEFAULT 'monthly',
    status ENUM('draft', 'reviewed', 'finalized') NOT NULL DEFAULT 'draft',
    total_gross_pay DECIMAL(15,2) DEFAULT 0.00,
    total_deductions DECIMAL(15,2) DEFAULT 0.00,
    total_net_pay DECIMAL(15,2) DEFAULT 0.00,
    employee_count INT DEFAULT 0,
    created_by INT NOT NULL,
    reviewed_by INT NULL,
    finalized_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    finalized_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(UserID),
    FOREIGN KEY (reviewed_by) REFERENCES users(UserID),
    FOREIGN KEY (finalized_by) REFERENCES users(UserID),
    
    INDEX idx_payrun_period (pay_period_start, pay_period_end),
    INDEX idx_payrun_status (status),
    INDEX idx_payrun_frequency (pay_frequency)
);

-- Pay Run Details Table (stores individual employee calculations)
CREATE TABLE payrun_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payrun_id INT NOT NULL,
    employee_id INT NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL,
    overtime_amount DECIMAL(15,2) DEFAULT 0.00,
    bonus_amount DECIMAL(15,2) DEFAULT 0.00,
    commission_amount DECIMAL(15,2) DEFAULT 0.00,
    gross_pay DECIMAL(15,2) NOT NULL,
    paye_tax DECIMAL(15,2) DEFAULT 0.00,
    nhif_deduction DECIMAL(15,2) DEFAULT 0.00,
    nssf_deduction DECIMAL(15,2) DEFAULT 0.00,
    housing_levy DECIMAL(15,2) DEFAULT 0.00,
    other_deductions DECIMAL(15,2) DEFAULT 0.00,
    total_deductions DECIMAL(15,2) NOT NULL,
    net_pay DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (payrun_id) REFERENCES payruns(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(EmployeeID),
    
    UNIQUE KEY unique_payrun_employee (payrun_id, employee_id),
    INDEX idx_payrun_details_employee (employee_id)
);

-- Employees table
CREATE TABLE Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    HireDate DATE NOT NULL,
    JobTitle VARCHAR(100),
    Department VARCHAR(100),
    Salary DECIMAL(10,2) NOT NULL,
    BankAccountNumber VARCHAR(50),
    TaxID VARCHAR(50)
);

-- Payroll table
CREATE TABLE Payroll (
    PayrollID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    PayPeriodStart DATE NOT NULL,
    PayPeriodEnd DATE NOT NULL,
    BaseSalary DECIMAL(10,2) NOT NULL,
    OvertimeHours INT DEFAULT 0,
    OvertimePay DECIMAL(10,2) DEFAULT 0.00,
    Bonuses DECIMAL(10,2) DEFAULT 0.00,
    Deductions DECIMAL(10,2) DEFAULT 0.00,
    NetSalary DECIMAL(10,2) DEFAULT 0.00,
    PaymentStatus ENUM('Pending', 'Paid') DEFAULT 'Pending',
    PaymentDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    notificationID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('salary', 'tax', 'leave', 'other') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Deductions table
CREATE TABLE Deductions (
    DeductionID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    DeductionType VARCHAR(100) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    DeductionDate DATE NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    PayrollID INT NOT NULL,
    EmployeeID INT NOT NULL,
    PaymentMethod ENUM('Bank Transfer', 'Cash', 'Cheque') NOT NULL,
    PaymentDate DATE NOT NULL,
    PaymentAmount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (PayrollID) REFERENCES Payroll(PayrollID) ON DELETE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Tax Table
CREATE TABLE Taxes (
    TaxID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    TaxType VARCHAR(100) NOT NULL,
    TaxAmount DECIMAL(10,2) NOT NULL,
    TaxYear YEAR NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Leaves table
CREATE TABLE Leaves (
    LeaveID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    LeaveType ENUM('Sick', 'Casual', 'Annual', 'Maternity', 'Paternity') NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);

-- Benefits table
CREATE TABLE Benefits (
    BenefitID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    BenefitType VARCHAR(100) NOT NULL,
    BenefitAmount DECIMAL(10,2) NOT NULL,
    DateGranted DATE NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);


-- Password is "payroll@john"

INSERT INTO Users (Username, PasswordHash, Email, UserType)
VALUES (
    'john.doe',
    '$2y$10$.24rSOdf/pnveZLILnoJpuHDvOhTOpMRreHVGDATCT8xs/KBOrFGy',
    'john.doe@payroll.com',
    'admin'
);

INSERT INTO Employees (
    FirstName,
    LastName,
    Email,
    Phone,
    HireDate,
    JobTitle,
    Department,
    Salary,
    BankAccountNumber,
    TaxID
) VALUES (
    'john',
    'doe',
    'john.doe@payroll.com',
    '+1 (316) 215-3468',
    '2025-02-06',
    'Human Resource',
    'hr',
    50000.00,
    '12345665',
    'das11'
);
