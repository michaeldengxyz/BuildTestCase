<?php
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

$data= array();
$data[error] = array();
$data[records] = 0;
$data[lines] = 0;
$xdata1 = array();
$xdata2 = array();

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
} 

$result = SQLQuery("SELECT `stepdesc`,`stepexpected` from `testcases` where `type`='steps' ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      $data[records]++;
      IsExist1($row[stepdesc]);
      IsExist1($row[stepexpected]);
      IsExist2($row[stepdesc]."\n".$row[stepexpected]);
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$data[data]['steps'] = $xdata1;
$data[data]['lines'] = $xdata2;

echo json_encode($data);

if($conn){
   mysql_close($conn);
}    

function IsExist1($s)
{
   global $xdata1;

   if($s){
      $e = 0;
      foreach($xdata1 as $n=>$val){
         if($xdata1[$n][1] == $s){
            $xdata1[$n][0]++;
            $e = 1;
            break;
         }
      }

      if($e == 0){
         $n = count($xdata1) + 1;
         $xdata1[$n][0] = 1;   
         $xdata1[$n][1] = $s;
      }
   }
}

function IsExist2($s)
{
   global $xdata2;
   global $data;

   foreach(preg_split("/\\n+/",$s) as $line){
      $data[lines]++;
      //$line = preg_replace("/^\\s*\\n*\\s*|\\s*\\n*\\s*$/",'',$line);
      //$line = preg_replace("/\\s+/",' ',$line);
      if($line){
         $e = 0;
         foreach($xdata2 as $n=>$val){
            if($xdata2[$n][1] == $line){
               $xdata2[$n][0]++;
               $e = 1;
               break;
            }
         }

         if($e == 0){
            $n = count($xdata2) + 1;
            $xdata2[$n][0] = 1;   
            $xdata2[$n][1] = $line;
         }
      }
   } 
}
?>