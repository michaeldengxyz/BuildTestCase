<?php
session_start();
//error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

if(!$_SESSION["CurrentUserEmail"]){
  die("<b style='color:red'>Please login!!</b>"); 
}

//$_SESSION["CurrentUserFailedTeam"] = 0;
if($_SESSION["CurrentUserFailedTeam"] > 5){  
    if($_SESSION["CurrentUserLastFailedVerifiedCodeTeam"]){
        $dt = (time() - $_SESSION["CurrentUserLastFailedVerifiedCodeTeam"])/60;
        $wt = 2**($_SESSION["CurrentUserFailedTeam"]/5);
        if($dt < $wt){
          $_SESSION["CurrentUserFailedTeam"]++;
          die("<a style='color:red'>Please come back after ".round($wt - $dt)." minutes, as you have tried and failed for ".$_SESSION["CurrentUserFailedTeam"]." times!</a>");  
        }
    }    
}
//----------------------------

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
    die("<b style='color:red'>".$connERR."</b>");  
} 

//----------------------------
$expired = time() + 3600*24*90;
if($_GET[bymyself]){
    $sqlstr = "";
    if($_GET[bymyself] == "confirm"){
        $sqlstr = "UPDATE `teams` SET  `verified`=1, `verified_expired`='".$expired."', `verified_due`='',`verified_code`='',`quit`=0 WHERE `id`='".$_GET[id]."' ";
        echo $expired;
    }else if($_GET[bymyself] == "quit"){
        $sqlstr = "UPDATE `teams` SET  `verified`=0, `verified_expired`='', `verified_due`='',`verified_code`='',`quit`=1 WHERE `id`='".$_GET[id]."' ";
        echo "QUIT";
    }

    SQLQuery($sqlstr,$conn);
    if($queryERR){
      echo $queryERR;
    }

    if($conn){
        mysql_close($conn);
    } 
    die("");
}

//----------------------------
$id = 0;
$verified_code = "";
$result = SQLQuery("SELECT `id`,`verified_code` from `teams` WHERE `id`='".$_GET[id]."' ",$conn); //`member`='".$_SESSION["CurrentUserEmail"]."' AND 
if($result){
    $row = mysql_fetch_array($result);
    $id = $row[id];
    $verified_code = $row[verified_code];
    mysql_free_result($result); 
}

if(md5($_GET[confirmcode]) == $verified_code){
    $_SESSION["CurrentUserFailedTeam"] = 0;    
    $sqlstr = "UPDATE `teams` SET  `verified`=1, `verified_expired`='".$expired."', `verified_due`='',`verified_code`='' WHERE `id`='".$id."' ";
    SQLQuery($sqlstr,$conn);
    if($queryERR){
      echo $queryERR;
    }

    echo $expired;
}else{
  $_SESSION["CurrentUserFailedTeam"]++;
  $_SESSION["CurrentUserLastFailedVerifiedCodeTeam"] = time();
  echo "<a style='color:red' >Confirm code is incorrect!!</a>";
}

if($conn){
  mysql_close($conn);
}    
?>