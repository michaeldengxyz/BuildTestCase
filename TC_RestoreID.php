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
 
//$who = get_current_user();
$who = $_SESSION["CurrentUserEmail"];
$now = time();
$errs= array();


$result = SQLQuery("SELECT `id` from `testcases` where `idx`='".$_POST[idx]."' limit 1",$conn); 
if($result){
   if(mysql_num_rows($result)){
      mysql_close($conn);
      die("<b style='color:red'>".preg_replace("/\,/",'-',number_format($_POST[idx]*1)).": existing, you may refresh the list!!</b>");  
   }
}else if($queryERR){
   mysql_close($conn);
   die("<b style='color:red'>".$queryERR."</b>");  
}

$POSTdata = null;
$result = SQLQuery("SELECT `log` from `testcases_log` WHERE `id`='".$_POST[dbid]."' ",$conn); 
if($result){                  
   $row = mysql_fetch_array($result);
   $POSTdata = json_decode($row['log']);
   //print_r($POSTdata);
   //echo $POSTdata->{idx};
   //echo("POSTdata: ".count($POSTdata));

}else if($queryERR){
   mysql_close($conn);
   die("<b style='color:red'>".$queryERR."</b>");  
}

//*
if($POSTdata->{idx}){
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
      die($queryERR."<br />".$sqlstr);
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
}else{
   $errs[] = "Not found ID!!";
}
//*/

if(count($errs)){
   echo join("<br />",$errs);
}else{
   echo 1;
}

if($conn){
   mysql_close($conn);
}    
?>