<?php
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
    die("<b style='color:red'>".$connERR."</b>");  
 } 

 $result = SQLQuery("SELECT `status` from `testcases` where `idx`='".$_POST[idx]."' AND `type`='name' limit 1",$conn); 
 if($result){  
      $row = mysql_fetch_array($result);
      if($row[status] == "Done"){
         die("<b style='color:red'>Status is updated to Done!!</b>");
      }
      mysql_free_result($result); 
 }else if($queryERR){
    mysql_close($conn);
    die($queryERR); 
 }


SQLQuery("DELETE from `testcases` where `idx`='".$_POST[idx]."' ",$conn); 
if($queryERR){
   echo $queryERR;  
}

SQLQuery("DELETE from `testcases_covered` where `testcase_id`='".$_POST[idx]."' ",$conn); 
if($queryERR){
   $errs[] = $queryERR;
}

if($conn){
   mysql_close($conn);
}    

echo 1;
?>