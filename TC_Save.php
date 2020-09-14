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

//-------------------------------------
/*
function ReplaceX($match)
{  

   echo "<div >0=".$match[0]."</div> <div >1=".$match[1]."</div><div >x={User-7".$match[2]."}</div>";
   return "{User-7".$match[2]."}";
}

//modify the roles, replace the space inside with '-';
$str = array("abc ...");
$afk = 0;
//$result = SQLQuery("SELECT `id`,`prere`,`coverage`,`stepdesc`,`stepexpected`,`type` from `testcases`",$conn); 
$result = SQLQuery("SELECT `id`,`prere` from `testcases` where idx in (select idx from `testcases` where module='ID07-Checklist') ",$conn);
//$result = SQLQuery("SELECT `id`,`stepdesc`,`stepexpected` from `testcases` ",$conn);  
if($result){  
   while($row = mysql_fetch_array($result)){  
      foreach(array("prere") as $n=>$p){
         if($row[$p] && preg_match('/User\-\d+/',$row[$p])){   
            echo "<div >".$row[$p]."</div>";         
            $val = preg_replace_callback('/(User\-(\d+))/', "ReplaceX",$row[$p]);
            //$str[] = "<div >".$row[$p]."</div> <div >".$val."</div>";
            echo "<div >".$val."</div><br />"; 
            $afk++;
            SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
         }
      }

   }

   mysql_free_result($result); 
}else if($queryERR){
   mysql_close($conn);
   die($queryERR); 
}

mysql_close($conn);
die(join("",$str)."<br>Affected rows: ".$afk);  
*/

/*

      foreach(array("stepdesc","stepexpected") as $n=>$p){
         if($row[$p] && preg_match('/User\-\d[^0-9]/',$row[$p])){
            //echo "<div >".$row[$p]."</div>";
            $val = preg_replace_callback('/((User\-(\d))[^0-9])/', "ReplaceX",$row[$p]);
            $str[] = "<div >O: ".$row[$p]."</div> <div >V: ".$val."</div><br />";
            $afk++;
            //SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
         }
      }

      foreach(array("prere","coverage","stepdesc","stepexpected") as $n=>$p){
         if($row[$p] && preg_match('/Quality\s+Manager|Audit\s+Coordinator|System\s+Admin|System\s+Owner/',$row[$p])){
            $val = preg_replace('/Quality\s+Manager/','Quality-Manager', $row[$p]);
            $val = preg_replace('/Audit\s+Coordinator/','Audit-Coordinator', $val);
            $val = preg_replace('/System\s+Admin/','System-Admin', $val);
            $val = preg_replace('/System\s+Owner/','System-Owner', $val);
            //$str[] = "<div >".$row[$p]."</div> <div >".$val."</div>";
            $afk++;
            SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
         }
      }

      foreach(array("prere") as $n=>$p){
         //if($row[$p] && preg_match('/URL\:\s+http\:\/\/azuse2jcas41\:4201\//',$row[$p])){
         //   $val = preg_replace('/URL\:\s+http\:\/\/azuse2jcas41\:4201\//','URL: https://qa.jcas.jblapps.com/', $row[$p]);
         //   $afk++;
         //   SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
         //}
         if($row[$p] && preg_match('/3.3.6 Language:/',$row[$p])){
            $val = preg_replace('/3.3.6 Language:/','3.2.6 Language:', $row[$p]);
            $afk++;
            SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
         }
      }

      foreach(array("stepexpected") as $n=>$p){
         if($row[$p] && preg_match('/\-The "Audit Trail" displays/',$row[$p])){
            $val = preg_replace('/\-The "Audit Trail" displays/',"- The \"Audit Trail\" displays", $row[$p]);            

            SQLQuery("UPDATE `testcases` SET `".$p."`='".addslashes($val)."' where `id`='".$row[id]."' ",$conn); 
            if($queryERR){
               echo "<div>".$queryERR."</div>";
            }else{
               echo "<div>".$row[id]."</div>";
               $afk++;
            }
         }
      }
*/
//-------------------------------------
/*
$str = array("abc ...");
$afk = 0;
//$result = SQLQuery("SELECT `id`,`prere`,`coverage`,`stepdesc`,`stepexpected`,`type` from `testcases` ",$conn); 
$result = SQLQuery("SELECT * from `testcases_covered` ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){  
      $afk++;
      SQLQuery("UPDATE `testcases_covered` SET `stroy_row`='".addslashes($row[stroy_row].".000")."', `stroy_text`='".addslashes("[".$row[stroy_row].".000]  ".$row[stroy_text])."'  where `id`='".$row[id]."' ",$conn); 
   }
   mysql_free_result($result); 
}else if($queryERR){
   mysql_close($conn);
   die($queryERR); 
}
   
mysql_close($conn);
die(join("",$str)."<br>Affected rows: ".$afk);  
*/
//-------------------------------------

if($_POST[data][checkin_time]){
   $err = "";

   $result = SQLQuery("SELECT `updated_when`,`updated_by`,`thread` from `testcases` where `idx`='".$_POST[data][idx]."' AND `type`='name' limit 1",$conn); 
   if($result){  
      $row = mysql_fetch_array($result);
      if($_POST[data][thread] != $row[thread] && $row[updated_when] > $_POST[data][checkin_time]){
         $err = "<div>Data have been changed and updated at ".date(DATE_ATOM,$row[updated_when])." (".HowLong($row[updated_when]).") by ".$row[updated_by]
                  ." in the thread #".$row[thread]."  ,after you checked in at ".date(DATE_ATOM,$_POST[data][checkin_time])." (".HowLong($_POST[data][checkin_time]).")</div>Please reload the data!";
      }
      mysql_free_result($result); 
   }else if($queryERR){
      mysql_close($conn);
      die($queryERR); 
   }

   if($err){
      mysql_close($conn);
      die($err); 
   }
}

SQLQuery("DELETE from `testcases` where `idx`='".$_POST[data][idx]."' ",$conn); 
if($queryERR){
   mysql_close($conn);
   die("<b style='color:red'>".$queryERR."</b>");  
}

$_POST[data][created_by] = $_POST[data][created_by] ? $_POST[data][created_by] : $who;
$sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`name`,`status`,`updated_by`,`updated_when`,`thread`,`created_by`, `module`) 
               VALUES (".$_POST[data][idx].",
                        'name','".addslashes($_POST[data][name])."',
                        '".$_POST[data][status]."',
                        '".addslashes($who)."',
                        ".$now.",
                        '".$_POST[data][thread]."',
                        '".addslashes($_POST[data][created_by])."',
                        '".addslashes($_POST[data][module])."'
                     )";
SQLQuery($sqlstr,$conn);
if($queryERR){
   die($queryERR);
}

$sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`prere`,`coverage`,`updated_by`,`updated_when`) 
                  VALUES (".$_POST[data][idx].",
                           'prere',
                           '".addslashes($_POST[data][prere])."',
                           '".addslashes($_POST[data][coverage])."',
                           '".addslashes($who)."',
                           ".$now."
                        )";
SQLQuery($sqlstr,$conn);
if($queryERR){
   $errs[] = $queryERR;
}

$sc = 0;
foreach($_POST[data][steps] as $stepid => $x1){
   $sc++;
   SQLQuery("INSERT INTO `testcases` (`idx`,`type`,`stepid`,`stepnumber`,`stepdesc`,`stepexpected`,`updated_by`,`updated_when`) 
                  VALUES (".$_POST[data][idx].",'steps',
                           ".$stepid.",
                           '".$_POST[data][steps][$stepid][stepNumb]."',
                           '".addslashes($_POST[data][steps][$stepid][stepDesc])."',
                           '".addslashes($_POST[data][steps][$stepid][stepExpe])."',
                           '".addslashes($who)."',
                           ".$now.")",
                        $conn);
   if($queryERR){
      $errs[] = $queryERR;
   }
} 

SQLQuery("DELETE from `testcases_covered` where `testcase_id`='".$_POST[data][idx]."' ",$conn); 
if($queryERR){
   $errs[] = $queryERR;
}
foreach($_POST[data][covered_story] as $sid => $x1){
   foreach($x1 as $n => $x2){
      $sqlstr =  "INSERT INTO `testcases_covered` (`testcase_id`,`story_id`,`stroy_row`,`stroy_text`) 
                     VALUES (".$_POST[data][idx].",
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
/*
if($_POST[data][idx] == '1595925440104'){
   //update the same for others
   $oidxs = array("1595925444597","1595925444618","1595925453101");
    
   foreach($oidxs as $n => $idx){
      SQLQuery("DELETE from `testcases_covered` where `testcase_id`='".$idx."' ",$conn);

      foreach($_POST[data][covered_story] as $sid => $x1){
         foreach($x1 as $n => $x2){
            $sqlstr =  "INSERT INTO `testcases_covered` (`testcase_id`,`story_id`,`stroy_row`,`stroy_text`) 
                           VALUES (".$idx.",
                                    ".$sid.",
                                    ".$x2[0].",
                                    '".addslashes($x2[1])."'
                                 )";
                                 
            SQLQuery($sqlstr,$conn);
         }
      }
   }
}
*/

$sqlstr = "INSERT INTO `testcases_log` (`idx`,`log`,`updated_by`,`updated_when`,`step_count`,`name`,`created_by`, `module`) 
                VALUES (".$_POST[data][idx].",
                        '".addslashes(json_encode($_POST[data]))."',
                        '".addslashes($who)."',
                        ".$now.",
                        ".$sc.",
                        '".addslashes($_POST[data][name])."',
                        '".addslashes($_POST[data][created_by])."',
                        '".addslashes($_POST[data][module])."'
                        )";
SQLQuery($sqlstr,$conn);
if($queryERR){
   $errs[] = $queryERR;
}

if(count($errs)){
   echo join("<br />",$errs);
}

if($conn){
   mysql_close($conn);
}    

echo 1;

function HowLong($s)
{
   $d = time() - $s;

   if($d < 60){
      return $d." sec ago";
   }else if($d < 3600){
      return (round($d/6)/10)." mins ago";
   }else if($d < 3600*24){
      return (round($d/360)/10)." hours ago";
   }else{
      $day = floor($d/3600/24);
      $hrs = round(($d - $day*24*3600)/360)/10;
      return $day."days and ".$hrs." hours ago";
   }

}
?>