<?php
session_start();

if (!isset($_SESSION['user'])) {
    // echo '<div style="color: red;"> You must log in to access that page. </div>';
    header('Location: /resources/pages/auth/signin.php');
    echo "You must log in to access that page.";
    exit;
    
}
