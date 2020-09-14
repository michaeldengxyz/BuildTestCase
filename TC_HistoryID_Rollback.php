<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

if(!$_SESSION["CurrentUserEmail"]){
   die("<b style='color:red'>Please login!!</b>"); 
}
 
//$who = get_current_user();
$who = $_SESSION["CurrentUserEmail"];
$now = time();


$data= array();
$data[error] = array();
$data[good]  = 0;

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
 } 
 

$sqlstr = "Select `log` from `testcases_log` WHERE `id`=" .$_POST[fromid];
$result = SQLQuery($sqlstr,$conn);
if($result){  
   $row = mysql_fetch_array($result);
   $POSTdata = json_decode($row['log']);
   mysql_free_result($result);

   if($POSTdata->{idx} == $_POST[idx]){
      SQLQuery("DELETE from `testcases` where `idx`='".$_POST[idx]."' ",$conn); 
      if($queryERR){
         mysql_close($conn);
         $data[error][] = $queryERR;
         die(json_encode($data)); 
      }

      $POSTdata->{created_by} = $POSTdata->{created_by}? $POSTdata->{created_by} : $who;

      $sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`name`,`status`,`updated_by`,`updated_when`,`thread`,`created_by`,`module`) 
                     VALUES (".$POSTdata->{idx}.",
                              'name','".addslashes($POSTdata->{name})."',
                              '".$POSTdata->{status}."',
                              '".addslashes($who)."',
                              ".$now.",'".$now."',
                              '".addslashes($POSTdata->{created_by})."',
                              '".($POSTdata->{module}? addslashes($POSTdata->{module}) : "")."'
                           )";
      SQLQuery($sqlstr,$conn);
      if($queryERR){
         mysql_close($conn);
         $data[error][] = $queryERR;
         die(json_encode($data));
      }
   
      $sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`prere`,`coverage`,`updated_by`,`updated_when`) VALUES (".$POSTdata->{idx}.",'prere','".addslashes($POSTdata->{prere})."','".addslashes($POSTdata->{coverage})."','".addslashes($who)."',".$now.")";
      SQLQuery($sqlstr,$conn);
      if($queryERR){
         $errs[] = $queryERR."<br />".$sqlstr;
      }
   
      $sc = 0;
      foreach($POSTdata->{steps} as $stepid => $x1){
         $sc++;
         SQLQuery("INSERT INTO `testcases` (`idx`,`type`,`stepid`,`stepnumber`,`stepdesc`,`stepexpected`,`updated_by`,`updated_when`) 
                        VALUES (".$POSTdata->{idx}.",'steps',
                                 ".$stepid.",
                                 '".$POSTdata->{steps}->{$stepid}->{stepNumb}."',
                                 '".addslashes($POSTdata->{steps}->{$stepid}->{stepDesc})."',
                                 '".addslashes($POSTdata->{steps}->{$stepid}->{stepExpe})."',
                                 '".addslashes($who)."',
                                 ".$now.")",
                              $conn);
         if($queryERR){
            $errs[] = $queryERR;
         }
      }
   
      if($POSTdata->{covered_story}){
         SQLQuery("DELETE from `testcases_covered` where `testcase_id`='".$POSTdata->{idx}."' ",$conn); 
         if($queryERR){
            $errs[] = $queryERR;
         }
         foreach($POSTdata->{covered_story} as $sid => $x1){
            foreach($x1 as $n => $x2){
               $sqlstr =  "INSERT INTO `testcases_covered` (`testcase_id`,`story_id`,`stroy_row`,`stroy_text`) 
                              VALUES (".$POSTdata->{idx}.",
                                       ".$sid.",
                                       ".$x2[0].",
                                       '".addslashes($x2[1])."'
                                    )";
                                    
               SQLQuery($sqlstr,$conn);
               if($queryERR){
                  $errs[] = $queryERR;
               }
            }
         }
      }

      $data[good]  = 1;
      $data[error][] = "Roll back now! <hr /> Please click <a style='font-weight:bold'>[Save]</a> to finally complete the roll-back!";
   }else{
      $data[error][] = "ID is not right!";
   }   
   
}else if($queryERR){
   $data[error][] = $queryERR."<br />".$sqlstr;
}

echo (json_encode($data)); 
if($conn){
   mysql_close($conn);
}    

?>