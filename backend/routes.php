<?php

use App\Services\Router;

Router::get('/api', function () {
    echo json_decode( 9);
});

Router::get('/api/{d+}', function ($d) {
    echo json_encode($d);
});
