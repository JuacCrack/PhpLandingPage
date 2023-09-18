<?php
class Response {
    public function send($status, $data) {
        http_response_code($status);
        echo json_encode($data);
    }
}
?>
