<?php
class Database {
    private $host = "localhost";
    private $db_name = "dafood";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }

        return $this->conn;
    }

    public function getDatabaseName() {
        // Obtiene el nombre de la base de datos desde la conexión PDO
        $databaseName = $this->conn->query("SELECT DATABASE()")->fetchColumn();
        
        return $databaseName;
    }

}
?>
