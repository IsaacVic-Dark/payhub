<?php

namespace App\Controllers;

use App\Services\DB;

class EmployeeController {
    public function index($orgId) {
        $filters = [
            'department' => $_GET['department'] ?? null,
            'job_title' => $_GET['job_title'] ?? null,
        ];
        $employees = DB::table('employees')->selectAllWhere('organization_id', $orgId);
        foreach ($filters as $key => $val) {
            if ($val !== null) {
                $employees = array_filter($employees, fn($e) => $e->$key == $val);
            }
        }
        return responseJson(
            data: array_values($employees),
            message: "Fetched employees",
            metadata: ['dev_mode' => true]
        );
    }
    public function create($orgId) {
        $data = validate([
            'user_id' => 'numeric',
            'first_name' => 'required,string',
            'last_name' => 'required,string',
            'email' => 'required,email',
            'phone' => 'string',
            'hire_date' => 'required,string',
            'job_title' => 'string',
            'department' => 'string',
            'reports_to' => 'numeric',
            'base_salary' => 'required,numeric',
            'bank_account_number' => 'string',
            'tax_id' => 'string'
        ]);
        $existingEmail = DB::table('employees')->selectAllWhere('email', $data['email']);
        if ($existingEmail) {
            return responseJson(null, "Email already exists", 400);
        }
        if (!empty($data['user_id'])) {
            $user = DB::table('users')->selectAllWhereID($data['user_id']);
            if (!$user) {
                return responseJson(null, "Invalid user_id", 400);
            }
        }
        if (!empty($data['reports_to'])) {
            $manager = DB::table('employees')->selectAllWhereID($data['reports_to']);
            if (!$manager) {
                return responseJson(null, "Invalid reports_to (manager)", 400);
            }
        }
        $inserted = DB::table('employees')->insert([
            'organization_id' => $orgId,
            'user_id' => $data['user_id'] ?? null,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'hire_date' => $data['hire_date'],
            'job_title' => $data['job_title'] ?? null,
            'department' => $data['department'] ?? null,
            'reports_to' => $data['reports_to'] ?? null,
            'base_salary' => $data['base_salary'],
            'bank_account_number' => $data['bank_account_number'] ?? null,
            'tax_id' => $data['tax_id'] ?? null,
        ]);
        return responseJson(
            data: $inserted,
            message: "Employee created successfully",
            metadata: ['dev_mode' => true]
        );
    }
    public function show($orgId, $id) {
        $employee = DB::table('employees')->selectAllWhere('organization_id', $orgId);
        $employee = array_filter($employee, fn($e) => $e->id == $id);
        if (!$employee) {
            return responseJson(null, "Employee not found", 404);
        }
        return responseJson(
            data: array_values($employee)[0],
            message: "Employee fetched successfully",
            metadata: ['dev_mode' => true]
        );
    }
    public function update($orgId, $id) {
        $data = validate([
            'user_id' => 'numeric',
            'first_name' => 'string',
            'last_name' => 'string',
            'email' => 'email',
            'phone' => 'string',
            'hire_date' => 'string',
            'job_title' => 'string',
            'department' => 'string',
            'reports_to' => 'numeric',
            'base_salary' => 'numeric',
            'bank_account_number' => 'string',
            'tax_id' => 'string'
        ]);
        $updateData = array_filter($data, fn($v) => $v !== null);
        if (isset($updateData['email'])) {
            $existingEmail = DB::table('employees')->selectAllWhere('email', $updateData['email']);
            if ($existingEmail && $existingEmail[0]->id != $id) {
                return responseJson(null, "Email already exists", 400);
            }
        }
        if (isset($updateData['user_id'])) {
            $user = DB::table('users')->selectAllWhereID($updateData['user_id']);
            if (!$user) {
                return responseJson(null, "Invalid user_id", 400);
            }
        }
        if (isset($updateData['reports_to'])) {
            $manager = DB::table('employees')->selectAllWhereID($updateData['reports_to']);
            if (!$manager) {
                return responseJson(null, "Invalid reports_to (manager)", 400);
            }
        }
        if (empty($updateData)) {
            return responseJson(null, "No data provided for update", 400);
        }
        $employee = DB::table('employees')->selectAllWhere('organization_id', $orgId);
        $employee = array_filter($employee, fn($e) => $e->id == $id);
        if (!$employee) {
            return responseJson(null, "Employee not found", 404);
        }
        $updated = DB::table('employees')->update($updateData, 'id', $id);
        if ($updated) {
            $employee = DB::table('employees')->selectAllWhere('organization_id', $orgId);
            $employee = array_filter($employee, fn($e) => $e->id == $id);
            return responseJson(
                data: array_values($employee)[0],
                message: "Employee updated successfully",
                metadata: ['dev_mode' => true]
            );
        } else {
            return responseJson(null, "Failed to update employee", 500);
        }
    }
    public function delete($orgId, $id) {
        $employee = DB::table('employees')->selectAllWhere('organization_id', $orgId);
        $employee = array_filter($employee, fn($e) => $e->id == $id);
        if (!$employee) {
            return responseJson(null, "Employee not found", 404);
        }
        $deleted = DB::table('employees')->delete('id', $id);
        if ($deleted) {
            return responseJson(
                data: null,
                message: "Employee deleted successfully",
                metadata: ['dev_mode' => true]
            );
        } else {
            return responseJson(null, "Failed to delete employee", 500);
        }
    }
}
