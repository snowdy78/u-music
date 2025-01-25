<?php
    function cors() {
    
        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
        
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        
            exit(0);
        }
        
    }
    function implodeToSqlData(string $sep, $arr) {
        $result = '';
        foreach ($arr as $key => $value) {
            if (!isset($value)) {
                unset($arr[$key]);
            }
        }
        foreach ($arr as $key => $value) {
            $str_value = ''.$value;
            if (gettype($value) === 'string') {
                $str_value = "'$str_value'";
            }
            $result .= "$str_value";
            if ($key != array_key_last($arr)) {
                $result .= "$sep ";
            }
        }
        return $result;
    }
    function arrayToEnumString(array $arr, string $sep) {
        $result = '';
        foreach ($arr as $key => $value) {
            if (!isset($value)) {
                unset($arr[$key]);
            }
        }
        foreach ($arr as $key => $value) {
            $str_value = ''.$value;
            if (gettype($value) === 'string') {
                $str_value = "'$str_value'";
            }
            $result .= "$key=$str_value ";
            if ($key != array_key_last($arr)) {
                $result .= "$sep ";
            }
        }
        return $result;
    }
    header('Content-Type: application/json');
    cors();
    enum MatchType {
        case All; 
        case Any;
    }
    function queryWhere(string $query, array $params, MatchType $match = MatchType::All) : string {
        $sql_operator_between = $match == MatchType::All ? "AND" : "OR";
        if (empty($params)) {
            return $query;
        }
        $query .= " WHERE ";
        $query .= arrayToEnumString($params, $sql_operator_between);
        return $query;
    }
    include_once 'database.php';
?>