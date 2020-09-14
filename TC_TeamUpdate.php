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

if($_POST[action] == "delete"){
   $sqlstr = "";
   if($_POST[dbids][0]){
      $sqlstr = "DELETE from `teams` WHERE `id`='".$_POST[dbids][0]."' ";
   }else if($_POST[dbids][1]){
      $sqlstr = "DELETE from `teams` WHERE `tmpid`='".$_POST[dbids][1]."' ";
   }

   SQLQuery($sqlstr,$conn); 
   if($queryERR){
      echo $queryERR;
   }

   if($conn){
      mysql_close($conn);
   } 

   die("1");
}

if($_POST[action] == "deleteTeam"){
   $sqlstr = "DELETE from `teams` WHERE `team_id`='".$_POST[teamid]."' ";

   SQLQuery($sqlstr,$conn); 
   if($queryERR){
      echo $queryERR;
   }

   if($conn){
      mysql_close($conn);
   } 

   die("1");
}

$isNameExist = 0;
$result = SQLQuery("SELECT `id` from `teams` WHERE `team_name`='".addslashes($_POST[teamname])."' AND `team_id`<>'".$_POST[teamid]."' ",$conn); 
if($result){
   while($row = mysql_fetch_array($result)){
      $isNameExist++;
   }

   mysql_free_result($result); 
}
if($isNameExist){
   echo "This Team Name is existing ($isNameExist)!";
   if($conn){
      mysql_close($conn);
   }    
   die("");
}


$isCreated = 0;
$teams  = array();
$result = SQLQuery("SELECT `tmpid`,`member` from `teams` WHERE `team_id`='".$_POST[teamid]."' ",$conn); 
if($result){
   while($row = mysql_fetch_array($result)){
      if($row[tmpid]){
         $teams[$row[tmpid]] = $row[member];
      }

      if($row[member] == $_SESSION["CurrentUserEmail"]){
         $isCreated++;
      }
   }

   mysql_free_result($result); 
}


if($isCreated == 0){
   $sqlstr = "INSERT INTO `teams` (`team_id`,`member`,`isowner`,`team_name`)  VALUES ('".$_POST[teamid]."','".addslashes($_SESSION["CurrentUserEmail"])."',1,'".addslashes($_POST[teamname])."')";
   SQLQuery($sqlstr,$conn);
   if($queryERR){
      mysql_close($conn);
      die($queryERR);
   }
}else{
   $sqlstr = "UPDATE `teams` SET `team_name`='".addslashes($_POST[teamname])."'  WHERE `team_id`='".$_POST[teamid]."'  AND `isowner`=1 ";
   SQLQuery($sqlstr,$conn);
   if($queryERR){
      $errs[] = $queryERR."<br />".$sqlstr;
   }
}

if($_POST[action] == "updateName"){
   if(count($errs)){
      echo join("<br />",$errs);
   }
   if($conn){
      mysql_close($conn);
   }    
   die("1");
}

$errs= array();
if(count($_POST[emails])){ //[id, email, tmpid]
   $sqlstr = "";
   if($_POST[emails][0]){
      $sqlstr = "UPDATE `teams` SET `member`='".addslashes($_POST[emails][1])."', WHERE `id`='".$_POST[emails][0]."' ";
   }else{
      if(array_key_exists($_POST[emails][3],$teams)){
         $sqlstr = "UPDATE `teams` SET `member`='".addslashes($_POST[emails][1])."', WHERE `tmpid`='".$_POST[emails][3]."' ";
      }else{
         $sqlstr = "INSERT INTO `teams` (`team_id`, `member`,`tmpid`) 
                        VALUES ('".$_POST[teamid]."',
                                '".addslashes($_POST[emails][1])."',
                                '".$_POST[emails][3]."'
                                )";
      }
   }

   SQLQuery($sqlstr,$conn);
   if($queryERR){
      $errs[] = $queryERR."<br />".$sqlstr;
   }
}

if(count($errs)){
   echo join("<br />",$errs);
}
if($conn){
   mysql_close($conn);
}    

echo 1;
?>