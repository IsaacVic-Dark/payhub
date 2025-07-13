<?php

namespace App\Controllers;

use App\Services\DB;
use App\Services\MainController;

class OrganizationController extends MainController {

    public function index() {
        return $this->responseJson(
            data: DB::table('organizations')->selectAll(),
            message: "Successfull fetch all organisations",
            metadata: ['dev_mode' => true]
        );
    }
    public function create() {
        //validate
        if (empty($_POST['name']) || empty($_POST['location']) || empty($_POST['logo_url']) || empty($_POST['currency'])) {
            return $this->responseJson(
                data: null,
                message: "All fields are required",
                code: 400
            );
        }

        //insert into db
        $inserted = DB::table('organizations')->insert([
            'name' => $_POST['name'],
            'location' => $_POST['location'],
            'logo_url' => $_POST['logo_url'],
            'currency' => $_POST['currency'],
        ]);
        return $this->responseJson(
            data: $inserted,
            message: "Organization created successfully",
            metadata: ['dev_mode' => true]
        );
    }
}
