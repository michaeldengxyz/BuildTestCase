<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

if(!$_SESSION["CurrentUserEmail"]){
   die("<b style='color:red'>Please login!!</b>"); 
}

$data= array();
$data[error] = array();
$data[data] = '';
$data['list'] = '';

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
 } 

$steps = array();
$result = SQLQuery("SELECT `idx`,count(`type`) as `scount` from `testcases` WHERE `type`='steps' GROUP BY `idx` ",$conn); 
if($result){                  
   while($row = mysql_fetch_array($result)){
      $steps[$row[idx]] = $row[scount];
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$result = SQLQuery("SELECT `idx`,`name`,`updated_when` from `testcases` WHERE `type`='name' AND `created_by`='".$_SESSION["CurrentUserEmail"]."' ORDER BY `name`, `idx`, `updated_when`",$conn);
if($result){   
   $list = array();                
   while($row = mysql_fetch_array($result)){
      $list[] = "<option value='".$row[idx]."' class='IDX".$row[idx]."' >#".preg_replace("/\,/",'-',number_format($row[idx]*1))."#  ".$row[name]." [".(array_key_exists($row[idx],$steps)? $steps[$row[idx]]: 0)."]</option>";
   }

   $data['list'] = join($list);

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}


echo json_encode($data);

if($conn){
   mysql_close($conn);
}    
?>