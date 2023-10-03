<?php 

class Item {
    private $conn;
    private $table_name;

    public function __construct($db, $table_name = null) {
        $this->conn = $db;
        $this->table_name = $table_name;
    }

    public function setField($data) {
        $bindParams = array();

        foreach ($data as $field => $value) {
            $bindParams[':' . $field] = $value;
        }

        return $bindParams;
    }

    public function insert($data) {
        $query = "INSERT INTO " . $this->table_name . " SET ";
        $bindParams = $this->setField($data);
    
        $setStatements = array();
        foreach ($bindParams as $field => $value) {
            $setStatements[] = substr($field, 1) . " = " . $field;
        }
    
        $query .= implode(", ", $setStatements) . ", date = NOW()";
    
        try {
            $stmt = $this->conn->prepare($query);
    
            foreach ($bindParams as $field => $value) {
                $stmt->bindValue($field, $value);
            }
    
            $stmt->execute();
    
            return true;

        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
            return false;
        }
    }
    
    public function login($data) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE ";
        $conditions = array();
        $bindParams = $this->setField($data);

        foreach ($bindParams as $field => $value) {
            $conditions[] = substr($field, 1) . " = " . $field;
        }

        $query .= implode(" AND ", $conditions);

        try {
            $stmt = $this->conn->prepare($query);

            foreach ($bindParams as $field => $value) {
                $stmt->bindValue($field, $value);
            }

            $stmt->execute();

            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
        }
    } 
                 
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " SET ";
        $bindParams = $this->setField($data);
        
        unset($bindParams[':id']); 
    
        $setStatements = array();
        foreach ($bindParams as $field => $value) {
            $setStatements[] = substr($field, 1) . " = " . $field;
        }
    
        $query .= implode(", ", $setStatements) . ", date = NOW() WHERE id = :id";
    
        $bindParams[':id'] = $id;
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($bindParams);
    
            return true;
        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
        }
    }

    public function getAll() {
        try {
            $query = "SELECT * FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
            return false;
        }
    }
    
    public function getTables($databaseName) {
        try {
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
        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
            return false;
        }
    }  
    
    public function delete($id) {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
            return false;
        }
    }
    

    }

?>


