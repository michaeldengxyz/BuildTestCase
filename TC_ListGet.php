<?php
session_start();
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

if(!$_SESSION["CurrentUserEmail"]){
   die("<b style='color:red'>Please login!!</b>"); 
}

$data= array();
$data[error] = array();
$data[data] = '';
$data['list'] = '';

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   $data[error][] = $connERR;
   die(json_encode($data));  
 } 

$steps = array();
$result = SQLQuery("SELECT `idx`,count(`type`) as `scount` from `testcases` WHERE `type`='steps' GROUP BY `idx` ",$conn); 
if($result){                  
   while($row = mysql_fetch_array($result)){
      $steps[$row[idx]] = $row[scount];
   }

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$wheres = "";
$wheresX = "";
if(count($_POST[wheres])){
   $wheres = "AND ";
   $wn = 0;                           // 0                 1      2       3               4               5
   foreach($_POST[wheres] as $cond){  //[logic.groupstart, field, logic.x txtsearch.value logic.groupeend logic.andor]
      $wn++;
      $wheres .= $cond[0]." `".$cond[1]."` ".$cond[2]." '".$cond[3]."' ".$cond[4];
      if($wn < count($_POST[wheres])){
         $wheres .= " ".$cond[5]." ";
      }else{
         $wheres .= " ";
      }

      if(preg_match("/idx|name|updated\\_by|updated\\_when|created\\_by/",$cond[1])){
         $wheresX .= $cond[0]." `".$cond[1]."` ".$cond[2]." '".$cond[3]."' ".$cond[4];
         if($wn < count($_POST[wheres])){
            $wheresX .= " ".$cond[5]." ";
         }else{
            $wheresX .= " ";
         }
      }
   }

   if($wheresX){
      $wheresX = " AND (".$wheresX.")";
   }

   //$data[error][] = $wheres;
   //$data[error][] = $wheresX;
}

$actives = array();
$dataX= array();
$list = array();
$total = 0;

//limit records whose owners are:
//    The current user or
//    The current user's teams members who are already verified in the teams;
$result = SQLQuery("SELECT `idx`,`name`,`status`,`updated_by`,`updated_when`,`created_by`,`module` from `testcases` 
                     WHERE `type`='name' ".$wheres."  
                           AND `created_by` IN (SELECT DISTINCT `member` from `teams` WHERE (`verified`=1 OR `isowner`=1) AND `team_id` IN (SELECT `team_id` FROM `teams` where  `member`='".$_SESSION["CurrentUserEmail"]."'))
                     ORDER BY `name`, `idx`, `updated_when`",$conn);
if($result){  
   $dataX[] = "<tr class='filter'>
                  <td class='tdlistFilter CN0 borderlefton' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN1' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN2' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN3' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN4' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN5' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN6' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN7' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN8' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN9' ><div class='divline' >&nbsp;</div></td>
                  <td class='tdlistFilter CN10' ><div class='divline' >&nbsp;</div></td>
               </tr>";             
   $n = 0;                  
   while($row = mysql_fetch_array($result)){
      $n++;
      $total++;

      $current = "";
      $color = "";
      if($_POST[curID] == $row[idx]){
         $current = " style='color: blue' ";
      }else if($row[status] == "Done"){
         $current = " style='color: green' ";
      }

      $actives[$row[idx]] = 1; 
      $isCanDelete = (($row[status] != "Done" && strtoupper($_SESSION["CurrentUserEmail"]) == strtoupper($row[created_by]))? 1 : 0);

      $isOwned = "";
      if(strtoupper($row[created_by]) == strtoupper($_SESSION["CurrentUserEmail"])){
         $isOwned = "owned";
      }

      $dataX[] = "<tr class='list' >
                           <td class='tdlist number IV borderlefton' ".$current.">".$n."</td>
                           <td class='tdlist idx IV' ".$current.">".preg_replace("/\,/",'-',number_format($row[idx]*1))."</td>
                           <td class='tdlist name IV ".$isOwned."' ".$current.">".$row[name]."</td>
                           <td class='tdlist module IV ".$isOwned."' ".$current." >".$row[module]."</td>
                           <td class='tdlist type2 IV' ".$current.">".(preg_match("/WhoCanActOnBehalf|WhoCanViewOnly/i",$row[name])? "Side" : "Basic")."</td>
                           <td class='tdlist steps IV' ".$current.">".(array_key_exists($row[idx],$steps)? $steps[$row[idx]]: 0)."</td>
                           <td class='tdlist status IV'".$current.">".($row[status]? $row[status] : 'Inwork')."</td>
                           <td class='tdlist createdby IV'".$current." title=\"".$row[created_by]."\" >".ParseName($row[created_by])."</td>
                           <td class='tdlist by IV'".$current." title=\"".$row[updated_by]."\" >".ParseName($row[updated_by])."</td>
                           <td class='tdlist when IV' ".$current.">".preg_replace("/T/"," ",date(DATE_ATOM,$row[updated_when]))."  <a style='font-size:small;color:#D0D0D0'>".HowLong($row[updated_when]*1)."</a></td>
                           <td class='tdlist ".($isCanDelete? "delete" : "")." IV' ".($isCanDelete? "title='Delete' " : "").">".($isCanDelete? "X" : "")."</td>
                     </tr>";

      $list[] = "<option value='".$row[idx]."' class='IDX".$row[idx]."' >#".preg_replace("/\,/",'-',number_format($row[idx]*1))."#  ".$row[name]." [".(array_key_exists($row[idx],$steps)? $steps[$row[idx]]: 0)."]</option>";
   }

   $data['list'] = join($list);
   //$data[data] = "<table style='width:100%'>".join($dataX)."</table>";

   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}


$result = SQLQuery("SELECT `id`,`idx`,`name`,`updated_by`,`updated_when`,`step_count`,`created_by`,`module` from `testcases_log` 
                     WHERE `created_by`='".$_SESSION["CurrentUserEmail"]."' ".$wheresX." ORDER BY `updated_when` DESC",$conn); 
if($result){  
   $n = 0;                  
   while($row = mysql_fetch_array($result)){
      if(array_key_exists($row[idx], $actives)){
         continue;
      }

      $n++;
      $total++;

      $dataX[] = "<tr class='list delete' >
                           <td class='tdlist IV borderlefton'>X".$n."</td>
                           <td class='tdlist idxx idx IV'>".preg_replace("/\,/",'-',number_format($row[idx]*1))."</td>
                           <td class='tdlist name IV' >".$row[name]."</td>
                           <td class='tdlist module IV' >".$row[module]."</td>
                           <td class='tdlist type2 IV' >".(preg_match("/WhoCanActOnBehalf|WhoCanViewOnly/i",$row[name])? "SIDE" : "BASIC")."</td>
                           <td class='tdlist steps IV' >".$row[step_count]."</td>
                           <td class='tdlist status IV' >Deleted</td>
                           <td class='tdlist createdby IV' title=\"".$row[created_by]."\" >".ParseName($row[created_by])."</td>
                           <td class='tdlist by IV'  title=\"".$row[updated_by]."\" >".ParseName($row[updated_by])."</td>
                           <td class='tdlist when IV'  >".preg_replace("/T/"," ",date(DATE_ATOM,$row[updated_when]))."  <a style='font-size:small;color:#D0D0D0'>".HowLong($row[updated_when]*1)."</a></td>
                           <td class='tdlist restore IV' title= 'Restore' data-dbid='".$row[id]."' >R</td>
                     </tr>";

      $actives[$row[idx]] = 1;                
   }
   
   mysql_free_result($result); 
}else if($queryERR){
   $data[error][] = $queryERR;
}

$data[data] = "<table class='list' >".join($dataX)."</table>";
//$data[data] = "<tbody>".join($dataX)."</tbody>";
$data[totlal_records] = $total;

echo json_encode($data);

if($conn){
   mysql_close($conn);
}    

function ParseName($s)
{
   $s = ucwords(preg_replace("/[\\_\\-\\.\\+\\*]+/"," ",preg_replace("/\\@.*$/","",strtolower($s))));
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

function HowLong($s)
{
   $d = time() - $s;

   if($d < 60){
      return $d."- sec ago";
   }else if($d < 3600){
      return (round($d/6)/10)." mins ago";
   }else if($d < 3600*24){
      return (round($d/360)/10)." hrs ago";
   }else{
      $day = floor($d/3600/24);
      $hrs = round(($d - $day*24*3600)/360)/10;
      return $day." days ".$hrs." hrs ago";
   }

}
?>