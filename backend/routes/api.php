<?php

if($_SERVER["REQUEST_METHOD"] === "POST"){
    if($_POST['action'] === "add_employee"){
        require "../modules/employees/add.php";
    }elseif($_POST['action'] === "add_payroll"){
        require "../modules/payroll/add.php";
    }elseif($_POST['action'] === "load_employee_view"){
        require "../resources/layouts/employees.view.php";
    }
}