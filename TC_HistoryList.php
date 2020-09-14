<?php
error_reporting(0);
header('Content-Type:text/html;charset=utf-8'); 

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   die($connERR);  
 } 

 
$result = SQLQuery("SELECT `id`,`updated_by`, `updated_when`,`step_count`,`created_by` from `testcases_log` WHERE `idx`=".$_POST[idx]." ORDER BY `updated_when` DESC ",$conn); 
if($result){                  
   $n = mysql_num_rows($result); 
   $nn= $n; 
   $dataX = array();             
   while($row = mysql_fetch_array($result)){      
      $dataX[] = "<tr class='list title W".$row[id]."' style='background:#F0F0F0;cursor:pointer' data-idx='".$row[id]."' title='click to show/hide the details' >                        
                        <td class='tdlist num'   style='border-style:none solid solid solid' ><li>Rev.".$n."</li></td>                                            
                        <td class='tdlist steps' >steps: ".$row[step_count]."</td>  
                        <td class='tdlist createdby'".$current." title=\"".$row[created_by]."\" >".ParseName($row[created_by])."</td>                   
                        <td class='tdlist by'    title=\"".$row[updated_by]."\" >".ParseName($row[updated_by])."</td>
                        <td class='tdlist when'  >".preg_replace("/T/"," ",date(DATE_ATOM,$row[updated_when]))."  <a style='font-size:small;color:#A0A0A0'>".HowLong($row[updated_when]*1)."</a></td>                           
                  </tr>
                  <tr class='list content W".$row[id]."' style='display:none' >
                        <td class='tdlist content R".$n."' data-rev=".$n." data-revs=".$nn."  data-idx='".$row[id]."' colspan=10 style='border-style:none solid solid solid' ></td>
                  </tr>
                  ";
      $n--;
   }

   mysql_free_result($result); 

   if(count($dataX)){
      echo "<table style='width:100%'>".join("",$dataX)."</table>";
   }else{
      echo "<div style='width:100%;background:yellow'>No history!</div>";
   }
}else if($queryERR){
   echo $queryERR;
}

if($conn){
   mysql_close($conn);
}    

function ParseName($s)
{
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