<?php 

include_once 'utils/validations.php';

class RequestHandler {
    public static function processRequest() {
        
        $table_name = $_GET['table'] ?? null;
        $action = $_GET['action'] ?? null;
        $data = json_decode(file_get_contents("php://input"), true);
        $data_array = $data['data'] ?? null;
        $id = $data['id'] ?? null;

        $allValues = array(
            'table_name' => $table_name,
            'action' => $action,
            'data' => $data_array,
            'id' => $id
        );

        $filteredData = Validations::validateData($allValues);

        return $filteredData;
    }
}

?>

