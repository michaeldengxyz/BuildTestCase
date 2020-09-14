<?php
session_start();
//error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

//$_SESSION["CurrentUserLastFailedVerifiedCode"] = 0;
//$_SESSION["CurrentVerifiedCodeTry"]  = 0;
if($_SESSION["CurrentUserLastFailedVerifiedCode"]){
  $dt = (time() - $_SESSION["CurrentUserLastFailedVerifiedCode"])/60;
  $wt = 5**($_SESSION["CurrentVerifiedCodeTry"]/5);
  if($dt < $wt){
    die("<a style='color:red'>Please come back after ".round($wt - $dt)." minutes, as you have tried and failed for ".$_SESSION["CurrentVerifiedCodeTry"]." times!</a>");  
  }
}

if($_SESSION["CurrentUserLastSendCode"]){
  $dt = time() - $_SESSION["CurrentUserLastSendCode"];
  if($dt < 60){
    $_SESSION["CurrentUserLastSendCode"] = time();
    die("<a style='color:red'>Please come back after 60 seconds! (".(60-$dt).") </a>");  
  }
}
$_SESSION["CurrentUserLastSendCode"] = time();
$_SESSION["CurrentUserLastFailedVerifiedCode"] = 0;
$_SESSION["CurrentVerifiedCodeTry"]  = 0;
$_SESSION["CurrentVerifiedCode"]  = 0;
$_SESSION["CurrentUserEmail"]  = "";
$_SESSION["CurrentUserEmailTemp"] = "";
$_SESSION["CurrentUserGroup"] = "";
  
$email = $_SESSION["CurrentUserEmailTemp"] = $_GET['email'];   
$_SESSION["CurrentUserEmailCodeSendTo"] = $_GET['email'];

if(!$email){
    die("<a style='color:red'>Email address is invalid!</a>");  
  }
  
$code = rand(1000,9999);  
$_SESSION["CurrentVerifiedCode"] = $code;

$subject   = "KKJ BT: ".$code;
$url='http://'.$_SERVER['SERVER_NAME'].$_SERVER["REQUEST_URI"]; 
$HTMLBody  = "<html xmlns='http://www.w3.org/1999/xhtml'>
                  <head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /></head>
                  <body style='font-family:Arial' > 
                      <p>Dear ".ParseName($email).",</p>
                      <div style='padding:5px 5px 5px 10px'>Welcome to KKJ BT System!</div>
                      <div style='padding:5px 5px 5px 10px'>You are about to login as this email address: ".$email."</div>
                      <div style='padding:5px 5px 5px 15px'>confirm as <b>".$code.".</b></div>
                      <div style='padding:5px 5px 5px 10px'>Enjoy!</div>   
                      <p>Best Regards</p>
                      <p><a href='".dirname($url)."' target='_blank' >KKJ BT System</a> (".dirname($url).")</p>
                  </body>
              </html>";

echo $HTMLBody."<br />";  //return;     
echo "<a style='color:#00CC00'>Email sends successfully to ". $email."</a>";
//include("#sendmsg.prg");  
//Send_Msg($subject,$email,$HTMLBody);   //subject,sendToemail,HTMLBody   


function ParseName($s)
{
   $s = ucwords(preg_replace("/[\\_\\-\\.\\+\\*]+/"," ",preg_replace("/\\@.*$/","",strtolower($s))));
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