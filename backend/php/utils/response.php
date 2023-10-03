<?php
class Response {
    public function send($status, $data = null) {
        http_response_code($status);
        
        if ($data !== null) {
            echo json_encode($data);
        }
    }
}
?>
