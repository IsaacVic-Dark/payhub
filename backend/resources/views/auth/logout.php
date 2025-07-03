<?php
require __DIR__.'/../../../routes/functions.php';
session_start();


session_unset();
$_SESSION = [];
session_destroy();

// dd($_SESSION);

// header('Location: /resources/pages/auth/signin.php');
header('Location: /resources/views/auth/signin.php');
exit();
 