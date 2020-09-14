<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

if(!$_SESSION["CurrentUserEmail"]){
   die("<b style='color:red'>Please login!!</b>"); 
}

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
    die("<b style='color:red'>".$connERR."</b>");  
 } 

$sqlstr = "DELETE from `testcases_covered` where `testcase_id`='".$_POST[idx]."' AND `story_id`='".$_POST[dbid]."' " ; 
SQLQuery($sqlstr,$conn);
if($queryERR){
   echo $queryERR;
}

if($conn){
   mysql_close($conn);
}    

echo 1;
?>