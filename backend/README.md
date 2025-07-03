# 🏢 Payroll Management System  

## 📌 Overview  
The **Payroll Management System** is a comprehensive solution for handling employee payroll processes, including salary calculations, deductions, bonuses, tax management, leave tracking, and payments. This system ensures accurate payroll processing while maintaining compliance with financial regulations.  

## 🚀 Features  
- 🏷 **Employee Management** – Store and manage employee details, salaries, and job roles.  
- 💰 **Payroll Processing** – Automate salary calculations, overtime, bonuses, and deductions.  
- 🏦 **Payments & Bank Transfers** – Record salary disbursements via different payment methods.  
- 📉 **Deductions & Taxes** – Automatically calculate tax deductions, insurance, and other contributions.  
- 🌴 **Leave Management** – Track employee leave requests and approvals.  
- 🎁 **Benefits Management** – Manage employee benefits such as medical and travel allowances.  

## 🛠 Tech Stack  
- **Database**: MySQL / PDO  
- **Backend**: PHP 

## 🗄 Database Schema  
The system uses a well-structured relational database with the following tables:  
✔ Employees  
✔ Payroll  
✔ Deductions  
✔ Payments  
✔ Taxes  
✔ Leaves  
✔ Benefits  

## 📜 Installation & Setup  
1. Clone the repository:  
   ```sh
   git clone https://github.com/IsaacVic-Dark/Payroll-System.git
   cd Payroll-System
   ```  
2. Set up the database (`MySQL` or `PostgreSQL`).  
3. Run migrations to create tables.  
4. Start the application. 

## 📦 TCPDF Installation
1. To set up TCPDF for generating pdf for payslips in this project, follow the steps below:

2. Install project dependencies (including TCPDF if already listed in composer.json):

   ```sh
      composer install
   ```
3. If TCPDF is not already included, add it manually using Composer:
   ```sh
      composer require tecnickcom/tcpdf
   ```

## 🤝 Contributing  
Contributions are welcome! Feel free to open an issue or submit a pull request.  
