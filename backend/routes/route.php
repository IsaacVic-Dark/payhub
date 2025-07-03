<?php

use App\Controllers\PagesController;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $page = $_POST['page'] ?? '';

    if ($page === 'logout') {
        // require_once __DIR__ . '/../resources/pages/auth/logout.php';
        require_once __DIR__ . '/../resources/views/auth/logout.php';
        exit;
    }

    require_once __DIR__ . '/../app/Middleware/check_auth.php';

    if ($page === 'home') {
        header('Location: /resources/layouts/index.php');
        exit;
    } elseif ($page === 'employees') {
        header("Location: /resources/layouts/employees.php");
        exit;
    } elseif ($page === 'leaves') {
        header("Location: /resources/layouts/leaves.php");
        exit;
    } elseif ($page === 'payrun') {
        header("Location: /resources/views/payrun.php");
        exit;
    } else {
        echo "Page not found";
    }
}