<?php 

class Method {
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


