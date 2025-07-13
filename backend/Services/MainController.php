<?php

namespace App\Services;

class MainController {
    public function responseJson($data, string $message, int $code = 200, array $metadata = []) {
        if (str_contains($message, 'error')) {
            $code = 500;
        }
        http_response_code($code);

        echo json_encode([
            'data' => $data,
            'message' => $message,
            'metadata' => empty($metadata) ? null : $metadata
        ]);
    }
}
