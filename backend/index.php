<?php
//consts
const BASE_PATH = __DIR__.'/'; //where index.php is located

require_once __DIR__ . '/helpers/init.php';

header("Access-Control-Allow-Origin: *"); // this will be set to the domain of the frontend app in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if(isset($_ENV['APP_ENVIRONMENT']) && $_ENV['APP_ENVIRONMENT'] === 'Development') {
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    //return html
    header("Content-Type: text/html");
} else {
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json"); 
}




// dd('Welcome to the PayHub backend!');
