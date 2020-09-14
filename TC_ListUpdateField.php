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

//$who = get_current_user();
$who = $_SESSION["CurrentUserEmail"];
$now = time();
$errs= array();

$sqlstr = "";
if($_POST[field] == "name" || $_POST[field] == "module"){   
   $sqlstr = "UPDATE `testcases` SET `".$_POST[field]."`='".$_POST[value]."', `updated_by`='".addslashes($who)."',`updated_when`=".$now.", `thread`='".$_POST[thread]."' WHERE `idx`='".$_POST[idx]."' AND `type`='name' ";
}else{
   $errs[] = "Unkown field (".$_POST[field].") !";
}

SQLQuery($sqlstr,$conn);
if($queryERR){
   $errs[] = $queryERR."<br />".$sqlstr;
}

if(count($errs)){
   echo join("<br />",$errs);
}
if($conn){
   mysql_close($conn);
}    

echo 1;
?>