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

$eid = 0;
$sqlstr = "";
if($_POST[dbid]){   
   $sqlstr = "SELECT `id` from `testcases_story` where `id`='".$_POST[dbid]."' ";
}else if($_POST[tmpid]){
   $sqlstr = "SELECT `id` from `testcases_story` where `tmpid`='".$_POST[tmpid]."' ";   
}

$result = SQLQuery($sqlstr,$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      $eid = $row[id];
   }
   
   mysql_free_result($result); 
}else if($queryERR){
   mysql_close($conn);
   die($queryERR); 
}

if(!$eid){
   $sqlstr = "SELECT `id` from `testcases_story` where `name`='".addslashes($_POST[name])."' ";
   $result = SQLQuery($sqlstr,$conn); 
   if($result){  
      while($row = mysql_fetch_array($result)){
         $eid = $row[id];
      }      
      mysql_free_result($result); 
   }else if($queryERR){
      mysql_close($conn);
      die($queryERR); 
   }
}

$sqlstr = "";
if($eid){
   $sqlstr = "UPDATE `testcases_story` 
               SET `content` ='".addslashes($_POST[content])."',
                   `updated_by`='".addslashes($who)."',
                   `updated_when`='".$now."', 
                   `name`='".$_POST[name]."',
                   `tmpid`='".$_POST[tmpid]."',
                   `sidx`  = '".$_POST[sidx]."',
                   `html`  = '".addslashes($_POST[html])."'
               WHERE `id`='".$eid."' " ; 
}else{
   $sqlstr = "INSERT INTO `testcases_story` (`name`,`content`,`created_by`,`updated_when`,`tmpid`,`sidx`,`html`) 
                     VALUES ('".addslashes($_POST[name])."',
                              '".addslashes($_POST[content])."',
                              '".addslashes($who)."',
                              ".$now.",
                              '".$_POST[tmpid]."',
                              '".$_POST[sidx]."',
                              '".addslashes($_POST[html])."'
                           )";
}

SQLQuery($sqlstr,$conn);
if($queryERR){
   $errs[] = $queryERR;
}

if(count($errs)){
   echo join("<br />",$errs);
}

if($conn){
   mysql_close($conn);
}    

echo 1;
?>