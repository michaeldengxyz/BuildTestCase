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
$fromlist = array();

if($_POST[fromidx]){
   $fromlist[] = $_POST[fromidx];
}else if(count($_POST[fromlist])){
   $fromlist = $_POST[fromlist];
}

$nj = 0;
foreach ($fromlist as $n => $fromidx){
   $nj++;

   $toidx = "";
   if($_POST[toidx]){
      $toidx = $_POST[toidx];
   }else{
      $st = preg_split("/\\s+/",microtime());
      $toidx = $st[1]."".sprintf("%03d",round($st[0]*1000) + $nj);
   }

   $name = "";
   $copydata = array();
   $result = SQLQuery("SELECT * from `testcases` where `idx`='".$fromidx."' ",$conn); 
   if($result){  
      while($row = mysql_fetch_array($result)){
         if($row[type] == 'steps' && $row[stepid]){
            $copydata[steps][$row[stepid]][stepNumb] = $row[stepnumber];
            $copydata[steps][$row[stepid]][stepDesc] = $row[stepdesc];
            $copydata[steps][$row[stepid]][stepExpe] = $row[stepexpected];
         }else if($row[type] == 'name'){
            $name = $row[name];
            $copydata[module] = $row[module];

         }else if($row[type] == 'prere'){
            $copydata[prere] = $row[prere];       
            $copydata[coverage] = $row[coverage];           
         }         
      }

      mysql_free_result($result); 
   }else if($queryERR){
      mysql_close($conn);
      die($queryERR);
   }

   //-------------------------
   $copydata[covered_story] = array();
   $result = SQLQuery("SELECT  * from  `testcases_covered` where  `testcase_id`='".$fromidx."' ",$conn); 
   if($result){  
      while($row = mysql_fetch_array($result)){    
         $copydata[covered_story][$row[story_id]][] = array($row[stroy_row],$row[stroy_text]);     
      }
   
      mysql_free_result($result); 
   }else if($queryERR){
      $data[error][] = $queryERR;
   }
   //-------------------------

   if($_POST[name]){
      $name = $_POST[name];
   }else{
      $name = $name." --- Copy";
   }

   //echo "<div>Copy from ".$fromidx." to ".$toidx.", ".$name."</div>";
   //continue;

   $pref = "";
   if($_POST[action] == "copy"){  
      SQLQuery("DELETE from `testcases`  where `idx`='".$toidx."' ",$conn);
      if($queryERR){
         mysql_close($conn);
         die($queryERR); 
      }


      $sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`name`,`updated_by`,`updated_when`,`created_by`,`module`) 
                  VALUES (".$toidx.",
                           'name',
                           '".addslashes($name)."',
                           '".addslashes($who)."',
                           ".$now.", 
                           '".addslashes($who)."',
                           '".addslashes($copydata[module])."'
                        )";                     
      SQLQuery($sqlstr,$conn);
      if($queryERR){
         die($toidx.': '.$queryERR);
      }

      $sqlstr = "INSERT INTO `testcases` (`idx`,`type`,`prere`,`coverage`,`updated_by`,`updated_when`) 
                        VALUES (".$toidx.",'prere','".addslashes($copydata[prere])."','".addslashes($copydata[coverage])."','".addslashes($who)."',".$now.")";
      SQLQuery($sqlstr,$conn);
      if($queryERR){
         $errs[] = $queryERR;
      }

      foreach($copydata[covered_story] as $sid => $x1){
         foreach($x1 as $n => $x2){
            $sqlstr =  "INSERT INTO `testcases_covered` (`testcase_id`,`story_id`,`stroy_row`,`stroy_text`) 
                           VALUES (".$toidx.",
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
   }else{
      $pref = $now."z";
   }

   foreach($copydata[steps] as $stepid => $x1){
      SQLQuery("INSERT INTO `testcases` (`idx`,`type`,`stepid`,`stepnumber`,`stepdesc`,`stepexpected`,`updated_by`,`updated_when`) 
                     VALUES (".$toidx.",'steps',
                              '".$pref.$stepid."',
                              '".$copydata[steps][$stepid][stepNumb]."',
                              '".addslashes($copydata[steps][$stepid][stepDesc])."',
                              '".addslashes($copydata[steps][$stepid][stepExpe])."',
                              '".addslashes($who)."',
                              ".$now.")",
                           $conn);
      if($queryERR){
         $errs[] = $queryERR;
      }
   }
}


if(count($errs)){
   echo join("<br /><br />",$errs);
}

if($conn){
   mysql_close($conn);
}    

echo 1;
?>