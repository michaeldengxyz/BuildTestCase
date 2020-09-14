<?php
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

$data= array();
$data[error] = array();

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
 } 

$result = SQLQuery("SELECT * from `testcases` where `idx` IN (".join(",",$_POST[idxs]).") ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      if($row[type] == 'steps' && $row[stepid]){
         $data[data][$row[idx]][steps][$row[stepid]][stepNumb] = $row[stepnumber];
         $data[data][$row[idx]][steps][$row[stepid]][stepDesc] = $row[stepdesc];
         $data[data][$row[idx]][steps][$row[stepid]][stepExpe] = $row[stepexpected];

      }else if($row[type] == 'name'){
         $data[data][$row[idx]][name] = $row[name];
         $data[data][$row[idx]][status] = ($row[status]? $row[status] : 'Inwork');
         $data[data][$row[idx]][created_by]   = ParseName($row[created_by]);
         $data[data][$row[idx]][updated_by]   = ParseName($row[updated_by]);
         $data[data][$row[idx]][updated_when] = date(DATE_ATOM,$row[updated_when]);
         $data[data][$row[idx]][module] = $row[module];
      }else if($row[type] == 'prere'){
         $data[data][$row[idx]][prere] = $row[prere];        
         $data[data][$row[idx]][coverage] = $row[coverage];                   
      }         
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

echo json_encode($data);

if($conn){
   mysql_close($conn);
}    

function ParseName($s)
{
   return $s;
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