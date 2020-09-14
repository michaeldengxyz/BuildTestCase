<?php
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

$data= array();
$data[error] = array();

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
 } 
 

$sqlstr = "Select `log` from `testcases_log` WHERE `id`=" .$_POST[id];
$result = SQLQuery($sqlstr,$conn);
if($result){  
   $row = mysql_fetch_array($result);
   echo $row[log];
   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR."<br />".$sqlstr;
   echo (json_encode($data)); 
}

if($conn){
   mysql_close($conn);
}    

?>