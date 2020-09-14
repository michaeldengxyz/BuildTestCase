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

$result = SQLQuery("SELECT * from `testcases` where `idx`='".$_POST[idx]."' ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      if($row[type] == 'steps' && $row[stepid]){
         $data[steps][$row[stepid]][stepNumb] = $row[stepnumber];
         $data[steps][$row[stepid]][stepDesc] = $row[stepdesc];
         $data[steps][$row[stepid]][stepExpe] = $row[stepexpected];

      }else if($row[type] == 'name'){
         $data[name] = $row[name];
         $data[status] = ($row[status]? $row[status] : 'Inwork');
         $data[created_by] = $row[created_by];
         $data[module] = $row[module];

      }else if($row[type] == 'prere'){
         $data[prere] = $row[prere];        
         $data[coverage] = $row[coverage];                   
      }         
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$data[covered_story] = array();
$result = SQLQuery("SELECT `testcases_story`.`name`, 
                           `testcases_covered`.`story_id`, `testcases_covered`.`stroy_row`, `testcases_covered`.`stroy_text`
                     from  `testcases_covered` join `testcases_story` 
                     where `testcases_covered`.`testcase_id`='".$_POST[idx]."'
                      AND  `testcases_covered`.`story_id`=`testcases_story`.`id` ORDER BY `testcases_story`.`name` ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      $data[covered_story][$row[story_id]][name] = $row[name];     
      $data[covered_story][$row[story_id]][rows][$row[stroy_row]] = $row[stroy_text];     
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$data[checkin_time] = time();

echo json_encode($data);

if($conn){
   mysql_close($conn);
}    

?>