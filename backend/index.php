<?php
//consts
const BASE_PATH = __DIR__.'/'; //where index.php is located

require_once __DIR__ . '/helpers/init.php';


header("Access-Control-Allow-Origin: *"); // this will be set to the domain of the frontend app in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json"); 




