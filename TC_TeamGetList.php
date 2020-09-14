<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

if(!$_SESSION["CurrentUserEmail"]){
   die("<b style='color:red'>Please login!!</b>"); 
}

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
    die("<b style='color:red'>".$connERR."</b>");  
 } 

$teams = array();
$data= array();
$data[error] = "";
$result = SQLQuery("SELECT * from `teams` WHERE  `team_id` IN (SELECT `team_id` FROM `teams` where  `member`='".$_SESSION["CurrentUserEmail"]."') ORDER BY `team_id`, `id` ",$conn); 
if($result){ 
   while($row = mysql_fetch_array($result)){
      $data[data][$row[team_id]]["members"][] = array($row[id], 
                                                      $row[member], 
                                                      ($row[verified]? ($row[verified_expired]*1 > time()? 1 : 0) : 0), 
                                                      $row[verified_due]*1,
                                                      $row[verified_expired]*1, 
                                                      $row[isowner]*1,
                                                      $row[quit]*1,
                                                   );
      if($row[isowner]){
         $data[data][$row[team_id]]["name" ] = $row[team_name];
         $data[data][$row[team_id]]["owner"] = strtoupper($row[member]);
      }
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error] = $queryERR;
}


echo json_encode($data); 

if($conn){
   mysql_close($conn);
}    

?>