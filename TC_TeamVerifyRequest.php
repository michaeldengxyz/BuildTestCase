<?php
session_start();
//error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

if(!$_SESSION["CurrentUserEmail"]){
  die("<b style='color:red'>Please login!!</b>"); 
}
 
if(!$_GET[sendTo]){
    die("<a style='color:red'>Email address is invalid!</a>");  
  }
  
$code = rand(1000,9999);  
$n= rand(0,11);
$url='http://'.$_SERVER['SERVER_NAME'].$_SERVER["REQUEST_URI"]; 
$subject   = ParseName($_SESSION["CurrentUserEmail"])." invites you to this Team [".$_GET[teamname]."], confirm as ".$code;
$HTMLBody  = "<html>
                  <head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head>
                  <body style='font-family:Arial' > 
                      <p>Dear ".ParseName($_SESSION["CurrentUserEmail"]).",</p>
                      <div style='padding:5px 5px 5px 10px'>Welcome to KKJ BT System!</div>
                      <div style='padding:5px 5px 5px 10px'>You are invited to this Team [".$_GET[teamname]."] by: ".ParseName($_SESSION["CurrentUserEmail"])." (".$_SESSION["CurrentUserEmail"].")</div>
                      <div style='padding:5px 5px 5px 15px'>confirm as <b>".$code.".</b></div>
                      <div style='padding:5px 5px 5px 10px'>As a Team Member, you will be able to review and update all items of each other's in the Team.</div>   
                      <p>Best Regards</p>
                      <p><a href='".dirname($url)."' target='_blank' >KKJ BT System</a> (".dirname($url).")</p>
                  </body>
              </html>";

echo "<div >A request notification is sent to ".$_GET[sendTo].", ".$_GET[teamid].", <br/> with the subject as <a style='font-weight:bold' >".ParseName($_SESSION["CurrentUserEmail"])." invites you into this Team [".$_GET[teamname]."] ...</a></div>";

include("#sendmsg.prg");  
Send_Msg($subject,$_GET[sendTo],$HTMLBody);   //subject,sendToemail,HTMLBody   

//save code to db
include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
    die("<b style='color:red'>".$connERR."</b>");  
} 
$due = time() + 3600*24;
$sqlstr = "UPDATE `teams` SET `verified_code`='".md5($code)."', `verified_due`='".$due."' WHERE `member`='".$_GET[sendTo]."' AND `team_id`='".$_GET[teamid]."' ";
SQLQuery($sqlstr,$conn);
if($queryERR){
   echo $queryERR;
}else{
   echo "<div class='verifieddue' style='display:none' >".$due."</div>";
}

if($conn){
  mysql_close($conn);
}    

function ParseName($s)
{
   $s = ucwords(preg_replace("/[\\_\\-\\.\\+\\*]+/"," ",preg_replace("/\\@.*$/","",$s)));
   //return $s;
   $xn = preg_split("/\\s+/", $s);   
   if(count($xn) >= 2){
      return $xn[0]." ".$xn[1];
   }else if(count($xn) == 1){
      return $xn[0];
   }else{
      return join(" ",$xn);
   }
}
?>