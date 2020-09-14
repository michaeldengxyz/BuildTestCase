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
$data = array();
$data['name'] = "";
$data['id'] = "";
$data['content'] = "";
$data['html'] = "";
$data['covered'] = array();
$data['error'] = "";

$result = SQLQuery("SELECT `id`,`name`,`content`,`sidx`,`html` from `testcases_story` where `id`='".$_POST[dbid]."' ",$conn); 
if($result){  
   $row = mysql_fetch_array($result);
   if($row[id]){
      $data['name']    = $row[name];
      $data['content'] = $row[content];
      $data['id']      = $row[id];
      $data['sid']     = $row[sidx];
      $data['html']    = $row[html];
   }
   mysql_free_result($result); 
}else if($queryERR){
   mysql_close($conn);
   $data['error'] = $queryERR; 
}

$where = "";
if($_POST[idx]){
   $where = " AND `testcase_id`<>'".$_POST[idx]."' ";
}
$result = SQLQuery("SELECT * from `testcases_covered` where `story_id`='".$_POST[dbid]."' ".$where,$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      $data['covered'][$row[stroy_row]][] = array($row[testcase_id],$row[stroy_text]);     
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

//$data['coveredsql'] = "SELECT * from `testcases_covered` where `story_id`='".$_POST[dbid]."' ".$where;

if(count($errs)){
   $data['error'] = join("<br />",$errs);
}

echo json_encode($data); 

if($conn){
   mysql_close($conn);
}    
?>