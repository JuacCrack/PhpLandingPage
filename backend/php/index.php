<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Origin: *");

include_once 'config/database.php';
include_once 'utils/response.php';
include_once 'deployments/deployment.php';
$db = new Database();
$response = new Response();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        try {
            $deployment = new Deployment($db);
            $result = $deployment->getAll();
    
            if ($result !== false) {
                $response->send(200, $result);
            } else {
                $response->send(204, $result);
            }
        } catch (PDOException $pdoException) {
            $response->send(500, array(
                'error' => $pdoException->getMessage(),
            ));
        }    
    break;

    case 'POST':
        try {
            $deployment = new Deployment($db);
            $result = $deployment->create();
    
            if ($result !== false) {
                $response->send(200, $result);
            } else {
                $response->send(401, $result);
            }

        } catch (PDOException $pdoException) {
            $response->send(500, array(
                'error' => $pdoException->getMessage(),
            ));
        }
    break;    

    case 'PUT':
        try {
            $deployment = new Deployment($db);
            $result = $deployment->update();

            if ($result !== false) {
                $response->send(200, $result);
            } else {
                $response->send(204, $result);
            }
        } catch (PDOException $pdoException) {
            $response->send(500, array(
                'error' => $pdoException->getMessage(),
            ));
        }
    break;

    case 'DELETE':
        try {
            $deployment = new Deployment($db);
            $result = $deployment->delete();
    
            if ($result !== false) {
                $response->send(200, $result);
            } else {
                $response->send(204, $result);
            }
        } catch (PDOException $pdoException) {
            $response->send(500, array(
                'error' => $pdoException->getMessage(),
            ));
        }
    break;

    default:
        $response->send(405, array("error" => "Método no permitido"));
    break;
}

?>
