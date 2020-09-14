<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

$_SESSION["CurrentVerifiedCodeTry"]  = 0;
$_SESSION["CurrentVerifiedCode"]     = 0;
$_SESSION["CurrentUserEmail"]        = "";
//$_SESSION["CurrentUserEmailTemp"] = "";
$_SESSION["CurrentUserGroup"]        = "";
//$_SESSION["CurrentUserLang"]         = "";
$_SESSION["CurrentUserUploadsize"] = 0;
$_SESSION["CurrentUserLastSendCode"] = 0;
$_SESSION["CurrentUserLastFailedVerifiedCode"] = 0;

echo 1;
?>