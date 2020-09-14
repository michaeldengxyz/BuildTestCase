<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8');

if($_SESSION["CurrentUserEmail"]){
    echo $_SESSION["CurrentUserEmail"];
}else{
    echo "";
}

?>