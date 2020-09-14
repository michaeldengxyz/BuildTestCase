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
$data = array();
$data['list'] = "";
$data['error'] = "";

$eid = 0;
$result = SQLQuery("SELECT `id`,`name`,`updated_when`,`sidx` from `testcases_story` where `created_by`='".addslashes($who)."' ORDER BY `name` ",$conn); 
if($result){  
   $list = array(
      "<tr >
            <td class='tdlistFilter bordertopton'  title='filter' colspan=2 >Filter</td>
            <td class='tdlistFilter bordertopton' ><input class='txtListFilter'  value='' /></td>
            <td class='tdlistFilter bordertopton button close' title='close' >x</td>
      </tr>
      <tr >
            <td class='tdlisth borderlefton' >No.</td>
            <td class='tdlisth' >ID</td>
            <td class='tdlisth' >Story Name <span class='filterstatus' style='font-size:small;font-weight:normal' ></span></td>
            <td class='tdlisth' >Last Update</td>
      </tr>"
   );
   
   $n = 0;
   while($row = mysql_fetch_array($result)){
      if($_POST[eids] && array_key_exists($row[id], $_POST[eids])){
         continue;
      }

      $n++;
      $list[] = "<tr class='list' data-dbid='".$row[id]."'>
                     <td class='tdlist borderlefton' >".$n."</td>
                     <td class='tdlist borderlefton' >".$row[sidx]."</td>
                     <td class='tdlist'>".$row[name]."</td>
                     <td class='tdlist'>".preg_replace("/T/"," ",date(DATE_ATOM,$row[updated_when]))."</td>
               </tr>";
   }
   
   if(count($list) == 1){   
      $list[0] = "<tr ><td colspan=4 style='color:red;padding:5px' class='tdlistFilter button close' >No story is available!</td></tr>";
   }

   $data['list'] = "<table>".join("",$list)."<table>";
   
   mysql_free_result($result); 
}else if($queryERR){
   $data['error'] = $queryERR;
}

if(count($errs)){
   $data['error'] = join("<br />",$errs);
}

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