<?php

require __DIR__ . '../../database/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['auth'] == 'login') {

    $email = $_POST['email'];
    $password = $_POST['password'];


    $stmt = $pdo->prepare("SELECT e.FirstName, u.* FROM employees AS e JOIN users AS u ON e.EmployeeID = u.UserID WHERE u.email = :email");

    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() < 0) {
        echo "User not found.";
        exit;
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!password_verify($password, $user['PasswordHash'])) {
        echo "Invalid password.";
        exit;
    }
    
    if (!empty($_SESSION['user'])) {
        $_SESSION = [];
    }

    $_SESSION['user'] = $user;
    
    session_regenerate_id(true);

    if ($_SESSION['user']['UserType'] === 'user') {
        header('Location: /resources/layouts/profile_employee.php');
        exit;
    } elseif ($_SESSION['user']['UserType'] === 'admin') {
        header('Location: /resources/layouts/index.php');
        exit;
    }

}
