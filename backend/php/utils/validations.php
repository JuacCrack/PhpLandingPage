<?php 

class Validations {

    public static function validateData($data) {

        $sqlInjection = self::detectSqlInjection($data);

        if ($sqlInjection) {
            $filter = self::filterData($data);
            return $filter;
        }

    }

    private static function filterData($data) {
        $filteredData = array();

        foreach ($data as $key => $value) {
            if ($value !== null && $value !== '') {
                $filteredData[$key] = $value;
            }
        }

        return  array(true, $filteredData);
    }

    private static function detectSqlInjection($requestData) {

        if (!isset($requestData['data']) || $requestData['data'] === null) {
            return true; 
        }

        $data = $requestData['data'];
    
        $sqlKeywords = array(
            'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'ALTER', 'CREATE', 'TRUNCATE'
        );
    
        foreach ($data as $value) {
            foreach ($sqlKeywords as $keyword) {
                if (stripos($value, $keyword) !== false) {
                    return false; 
                }
            }
        }
    
        return true; 
    }
}

?>
