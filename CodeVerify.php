<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

//$_SESSION["CurrentVerifiedCodeTry"] = 0;
//$_SESSION["CurrentUserLastFailedVerifiedCode"] = 0;
$_SESSION["CurrentUserEmail"]  = "";
$_SESSION["CurrentVerifiedCodeTry"]++;
if($_SESSION["CurrentVerifiedCodeTry"] > 5){
  $_SESSION["CurrentUserLastFailedVerifiedCode"] = time();
  die("<a style='color:red'>Try time is more than 5!</a>");     
}
  
$code = $_GET['code'];   

if($_SESSION["CurrentUserEmailCodeSendTo"] != $_GET['email']){
    die("<a style='color:red'>The Email Address is changed, please Get Validation Code again!</a>");  
}

if($code != $_SESSION["CurrentVerifiedCode"]){          
    die("<a style='color:red'>(".$code." | ".$_GET['email']."): Validation Code is not correct!</a><br />".
           "Try time: ".(5 - $_SESSION["CurrentVerifiedCodeTry"])
       );  
  }

$_SESSION["CurrentVerifiedCodeTry"] = 0;  
$_SESSION["CurrentUserLastFailedVerifiedCode"] = 0;
$_SESSION["CurrentVerifiedCode"] = 0;                                                                 
$_SESSION["CurrentUserEmail"] = $_GET['email'];

echo 1;
?>