<?php 

class Token {

    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function isTokenValid($id_user) {
        $query = "SELECT COUNT(*) AS count FROM token WHERE id_user = :id_user 
                  AND datetime >= DATE_SUB(NOW(), INTERVAL 4 HOUR)";
        
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return ($result['count'] > 0);
        } catch (PDOException $pdoException) {
            return false;
        }
    }

    public function getTokenForUser($data) {

        $id_user = $data['id'];
        $category = $data['category'];

        $query = "SELECT token FROM token WHERE id_user = :id_user 
                  ORDER BY datetime DESC LIMIT 1";
    
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
            $stmt->execute();
    
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($result['token'] !== null) {

                $token = array(
                    "token" => $result['token'],
                    "id_user" => $id_user
                );

                $response = array(
                    "category" => $category,
                    "token" => $token
                );

                return $response;

            } else {
                return false;
            }
        } catch (PDOException $pdoException) {
            return false;
        }
    }

    public function generateToken($data) {

        $id_user = $data['id'];
        $category = $data['category'];

        $token = uniqid();

        $array = array(
            "token" => $token,
            "id_user" => $id_user
        );

        $insertTokenQuery = "INSERT INTO token (id_user, token, datetime) VALUES (:id_user, :token, NOW())";
        $stmt = $this->conn->prepare($insertTokenQuery);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $response = $stmt->execute();

        if ($response) {

            $tokenResponse = array(
                "category" => $category,
                "token" => $array
            );            
            
            return $tokenResponse;
        } else {
            return false;
        }

    }
    
}

?>

