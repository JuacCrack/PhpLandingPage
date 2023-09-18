<?php 

class Validations {
    public static function filterData($data) {
        $filteredData = array();

        foreach ($data as $key => $value) {
            if ($value !== null && $value !== '') {
                $filteredData[$key] = $value;
            }
        }

        return $filteredData;
    }
}                                                                                                                                                                                                                                                

?>
