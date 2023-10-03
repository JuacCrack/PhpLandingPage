<?php

include_once 'utils/RequestHandler.php';
include_once 'objects/item.php'; 

    class Model {
        private $conn;
        private $requestData;

        public function __construct($db) {
            $this->conn = $db->getConnection();
            $this->db_name = $db->getDatabaseName();
            $this->requestData = RequestHandler::processRequest();
        }

        public function create() {
            $table_name = $this->requestData['table_name'];
            $data = $this->requestData['data'];
            $action = $this->requestData['action'];
            
            $item = new Item($this->conn, $table_name);
            
            try {
                switch ($action) {
                    case 'login':
                        return $item->login($data);
            
                    case 'POST':
                        return $item->insert($data);
            
                    default:
                        return false;
                }
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }      

        public function getAll() {
            try {
                $action = $this->requestData['action'];
        
                switch ($action) {
                    case 'GET':
                        $table_name = $this->requestData['table_name'];
        
                        $item = new Item($this->conn, $table_name);
            
                        return $item->getAll();
                    break;
        
                    case 'GETALL':
        
                        $item = new Item($this->conn);
            
                        return $item->getTables( $this->db_name);
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
            try {
                $table_name = $this->requestData['table_name'];
                $id = $this->requestData['id'];
            
                $item = new Item($this->conn, $table_name);
            
                return $item->delete($id);
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        

        public function update() {
            try {
                $table_name = $this->requestData['table_name']; 
                $data = $this->requestData['data'];
                $id = $this->requestData['id']; 
            
                $item = new Item($this->conn, $table_name);
                return $item->update($id, $data);
            } catch (PDOException $pdoException) {
                return $pdoException->getMessage();
            }
        }
        
    }
    
?>


