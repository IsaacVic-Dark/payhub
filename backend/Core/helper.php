<?php


class PaginationHelper
{
    public static function getPagination($params)
    {

        $pdo = $params['pdo'];
        $table = $params['table'];
        $limit = $params['limit'];

        $page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page - 1) * $limit;

        $totalStmt = $pdo->query("SELECT COUNT(*) FROM {$table}");
        $totalItems = $totalStmt->fetchColumn();
        $totalPages = ceil($totalItems / $limit);

        return [
            'limit' => $limit,
            'offset' => $offset,
            'page' => $page,
            'totalPages' => $totalPages,
        ];
    }
}
