<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Origin: *");

include_once 'config/database.php';
include_once 'objects/item.php';
include_once 'utils/response.php';
include_once 'models/Model.php'; // Importar la clase Model

$db = new Database();
$response = new Response();

// Manejo de las peticiones
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        try {
            $model = new Model($db);
            $result = $model->getAll();
    
            if ($result) {
                $response->send(200, $result);
            } else {
                $response->send(204, array("message" => "No se encontraron elementos."));
            }
        } catch (PDOException $e) {
            $response->send(500, array(
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ));
        }
    break;

    case 'POST':
        try {
            $model = new Model($db);
            $result = $model->create();
    
            if ($result !== false) {
                $response->send(200, $result); // Devuelve los datos en lugar de un mensaje
            } else {
                $response->send(500, array("error" => "No se pudo insertar el registro"));
            }
        } catch (PDOException $e) {
            $response->send(500, array(
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ));
        }
    break;    

    case 'PUT':
        try {
            $model = new Model($db);
            $result = $model->update();

            if ($result) {
                $response->send(200, array("message" => "Registro actualizado correctamente"));
            } else {
                $response->send(500, array("error" => "No se pudo actualizar el registro"));
            }
        } catch (PDOException $e) {
            $response->send(500, array(
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ));
        }
    break;

    case 'DELETE':
        try {
            $model = new Model($db);
            $result = $model->delete();
    
            if ($result) {
                $response->send(200, array("message" => "Registro eliminado exitosamente"));
            } else {
                $response->send(500, array("error" => "No se pudo eliminar el registro"));
            }
        } catch (PDOException $e) {
            $response->send(500, array(
                'error' => 'Error en la consulta de la base de datos',
                'message' => $e->getMessage()
            ));
        }
    break;

    default:
        $response->send(405, array("error" => "Método no permitido"));
    break;
}

?>
