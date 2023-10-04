<?php

include_once 'utils/RequestHandler.php';
include_once 'methods/method.php'; 
include_once 'methods/utilsMethod.php';

    class Deployment {
        private $conn;
        private $requestData;

        public function __construct($db) {
            $this->conn = $db->getConnection();
            $this->db_name = $db->getDatabaseName();
            $this->requestData = RequestHandler::processRequest();
        }

        public function create() {
        
            $isValid = $this->requestData[0]; 
            $requestData = $this->requestData[1]; 
        
            if (!$isValid) {
                return false;
            }
        
            $table_name = $requestData['table_name'];
            $data = $requestData['data'];
            $action = $requestData['action'];
        
            try {
                switch ($action) {
                    case 'login':
                        $utilsmethod = new utilsMethod($this->conn, $table_name);
                        return $utilsmethod->login($data);
        
                    case 'POST':
                        $method = new Method($this->conn, $table_name);
                        return $method->insert($data);
        
                    default:
                        return false;
                }
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        
        public function getAll() {

            $isValid = $this->requestData[0]; 
            $requestData = $this->requestData[1]; 
        
            if (!$isValid) {
                return false;
            }

            try {
                $action = $requestData['action'];
                $table_name = $requestData['table_name'];
        
                switch ($action) {
                    case 'GET':
        
                        $method = new Method($this->conn, $table_name);
            
                        return $method->getAll();
                    break;
        
                    case 'GETALL':
        
                        $utilsmethod = new utilsMethod($this->conn, $table_name);
            
                        return $utilsmethod->getTables( $this->db_name);
                    break;
                    
                    default:
                        return false;
                    break;
                }
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        
        public function delete() {

            $isValid = $this->requestData[0]; 
            $requestData = $this->requestData[1]; 
        
            if (!$isValid) {
                return false;
            }

            try {
                $table_name = $requestData['table_name'];
                $id = $requestData['id'];
            
                $method = new Method($this->conn, $table_name);
            
                return $method->delete($id);
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        
        public function update() {

            $isValid = $this->requestData[0]; 
            $requestData = $this->requestData[1]; 
        
            if (!$isValid) {
                return false;
            }

            try {
                $table_name = $requestData['table_name']; 
                $data = $requestData['data'];
                $id = $requestData['id']; 
            
                $method = new Method($this->conn, $table_name);
                return $method->update($id, $data);
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        
    }
    
?>


