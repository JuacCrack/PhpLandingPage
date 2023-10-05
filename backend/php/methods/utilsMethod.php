<?php 

include_once 'utils/token.php';

class utilsMethod {

    private $conn;
    private $table_name;

    public function __construct($db, $table_name = null) {
        $this->conn = $db;
        $this->table_name = $table_name;
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
    
            $userResponse = $stmt->fetch(PDO::FETCH_ASSOC);

    
            if ($userResponse) {
                $classToken = new Token($this->conn);
    
                if ($classToken->isTokenValid($userResponse['id'])) {
                    $token = $classToken->getTokenForUser($userResponse);
                    return $token;
                } else {
                    $newToken = $classToken->generateToken($userResponse);
                    return $newToken;
                }
            } else {
                return false;
            }
    
        } catch (PDOException $pdoException) {
            echo "PDO Exception: ";
            echo $pdoException->getMessage();
            return $pdoException->getMessage();
        }
    }
    
    
    public function setField($data) {
        $bindParams = array();

        foreach ($data as $field => $value) {
            $bindParams[':' . $field] = $value;
        }

        return $bindParams;
    }

    public function createTable($data) {
    
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (";
    
        foreach ($tableStructure as $columnName => $columnType) {
            $query .= $columnName . " " . $columnType . ",";
        }
    
        $query = rtrim($query, ',') . ")";
    
        try {
            $stmt = $this->conn->prepare($query);

            $stmt->execute();
    
            return true;
        } catch (PDOException $pdoException) {
            return $pdoException->getMessage();
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

}


?>