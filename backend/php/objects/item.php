<?php 

    class Item {
        private $conn;
        private $table_name;
        private $fields;

        public function __construct($db, $table_name = null) {
            $this->conn = $db;
            $this->table_name = $table_name;
            $this->fields = array();
        }

        public function setField($field, $value) {
            $this->fields[$field] = $value;
        }

        public function getAll() {
            $query = "SELECT * FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
        public function getTables($databaseName) {
            
            $query = "SELECT 
                        TABLE_NAME AS 'table',
                        COLUMN_NAME AS 'column',
                        COLUMN_TYPE AS 'type',
                        COLUMN_KEY AS 'key'
                      FROM
                        information_schema.columns
                      WHERE
                        TABLE_SCHEMA = :databaseName";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':databaseName', $databaseName, PDO::PARAM_STR);
            $stmt->execute();
            
            $tableData = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tableName = $row['table'];
                unset($row['table']);
            
                if (!isset($tableData[$tableName])) {
                    $tableData[$tableName] = array();
                }
            
                $tableData[$tableName][] = $row;
            }
            
            return $tableData;
        }        
        
        public function insert() {
            $query = "INSERT INTO " . $this->table_name . " (" . implode(',', array_keys($this->fields)) . ", date)
                    VALUES (:" . implode(',:', array_keys($this->fields)) . ", NOW())";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute($this->fields);
            
            return $result;
        }
        
        public function login() {
            $query = "SELECT * FROM " . $this->table_name . " WHERE ";
            
            $conditions = array();
            foreach ($this->fields as $field => $value) {
                $conditions[] = $field . " = :" . $field;
                $this->setField($field, $value);
            }
            
            $query .= implode(" AND ", $conditions);
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute($this->fields);
            
            return $stmt->fetch(PDO::FETCH_ASSOC); 
        }        
        
        public function update($id) {
    
            $query = "UPDATE " . $this->table_name . " SET ";
            foreach ($this->fields as $field => $value) {
                $query .= $field . "=:" . $field . ",";
            }
            $query = rtrim($query, ',');
            $query .= ", date = NOW() WHERE id=:id";
            
            $stmt = $this->conn->prepare($query);
            $this->fields['id'] = $id;
            $result = $stmt->execute($this->fields);
            
            return $result;
        }
        
        public function delete($id) {
            $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
            $stmt = $this->conn->prepare($query);
            
            return $stmt->execute(array('id' => $id));
        }        

    }

?>


