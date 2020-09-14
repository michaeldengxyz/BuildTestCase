<?php
function Connect_mdb($host)
{ 
global $connERR;

$conn = '';
$connERR = "";

if(!$host){
    $host = "localhost";
  }

//echo "连接服务器: ".$host."<br />";  
try{ 
     $conn = mysql_connect($host,'we2','12345$9876');
  }catch(Exception $e){
     $conn = '';
  }

if(!$conn){
    $connERR = "Failed to connect the server - ".$host." (".mysql_error().")";
  }

return $conn;  
}

function SQLQuery($sqlquery,$conn)
{
global $queryERR;

$queryERR= "";
$result = "";
//echo $sqlquery."<br />";
if($conn){
    mysql_select_db("build_story", $conn);  
    mysql_query("SET NAMES utf8");
    $result = mysql_query($sqlquery);    
    
    if(!$result){
        $result = "";
        $queryERR = "Query Error : ". mysql_error(); 
    }
  } 
  
return $result; 
} 

function ZLog($table,$op,$log,$conn)
{
  SQLQuery("INSERT INTO `z_log` (`table`,`operation`,`updated_by`,`updated_when`,`log`) VALUES ('".$table."','".$op."','".addslashes(get_current_user())."','".time()."','".addslashes($log)."') ",$conn);
}
?>
