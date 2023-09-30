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

        public function getAll() {

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

        }

        public function create() {
            $table_name = $this->requestData['table_name'];
            $data = $this->requestData['data'];
            
            $item = new Item($this->conn, $table_name);
            foreach ($data as $field => $value) {
                $item->setField($field, $value);
            }

            $action = $this->requestData['action'];

            switch ($action) {
                case 'login':
                    return $item->login();
                break;

                case 'POST':
                    return $item->insert();
                break;
                
                default:
                    return false;
                break;
            }
        
        }        
        
        public function update() {
            $table_name = $this->requestData['table_name']; // Corrección aquí
            $data = $this->requestData['data'];
            $id = $this->requestData['id']; // Corrección aquí
        
            $item = new Item($this->conn, $table_name);
            foreach ($data as $field => $value) {
                $item->setField($field, $value);
            }
        
            return $item->update($id);
        }        
        
        public function delete() {

            $table_name = $this->requestData['table_name'];
            $id = $this->requestData['id'];
        
            $item = new Item($this->conn, $table_name);
        
            return $item->delete($id);
        }        
        
    }
    
?>


