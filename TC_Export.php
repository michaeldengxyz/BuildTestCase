<?php
error_reporting(1);
//header('Content-Type:text/html;charset=utf-8'); 

include("#connect_db.prg"); 
$conn = Connect_mdb();
if(!$conn){
   die($connERR);  
 } 
//echo "idx=".$_POST[idx];
$result = SQLQuery("SELECT * from `testcases` where `idx`='".$_GET[idx]."' ",$conn); 
if($result){  
   while($row = mysql_fetch_array($result)){
      if($row[type] == 'steps' && $row[stepid]){
         $data[steps][$row[stepid]][stepNumb] = $row[stepnumber];
         $data[steps][$row[stepid]][stepDesc] = $row[stepdesc];
         $data[steps][$row[stepid]][stepExpe] = $row[stepexpected];

      }else if($row[type] == 'name'){
         $data[name] = $row[name];
         $data[status] = ($row[status]? $row[status] : 'Inwork');
      }else if($row[type] == 'prere'){
         $data[prere] = $row[prere];   
         //echo $data[prere];               
      }         
   }

   mysql_free_result($result);
   
   try{      
      /*
      require 'PHPExcel-1.8/Classes/Classes/PHPExcel.php';
      $obj = new PHPExcel();
      $writer = new PHPExcel_Writer_Excel5($obj);

      $sheet = new PHPExcel_Worksheet($obj, 'Prerequisites');
      $obj->addSheet($sheet);
      $obj->setActiveSheetIndex(0); 
      $curSheet = $obj->getActiveSheet();
      $curSheet->setCellValue('A1', $data[prere]);

      $sheet1 = new PHPExcel_Worksheet($obj, 'Steps');
      $obj->addSheet($sheet1);
      $obj->setActiveSheetIndex(1); 
      $curSheet = $obj->getActiveSheet();

      $curSheet->setCellValue('A1', "No.");
      $curSheet->setCellValue('B1', "Description");
      $curSheet->setCellValue('C1', "Expected Result");
      $curSheet->getStyle('A1')->getFont()->setBold(true);
      $curSheet->getStyle('B1')->getFont()->setBold(true);
      $curSheet->getStyle('C1')->getFont()->setBold(true);

      $curSheet->getColumnDimension('A')->setWidth(15);
      $curSheet->getColumnDimension('B')->setWidth(40);
      $curSheet->getColumnDimension('C')->setWidth(40);

      $row = 1;
      foreach($data[steps] as $sid => $x1){
         $row++;
         if($row%2 == 1){
            $curSheet->getStyle('A1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $curSheet->getStyle('A1')->getFill()->getStartColor()->setARGB('f4f4f4');
         }

         $curSheet->setCellValue('A'.$row, $data[steps][$sid][stepNumb]);
         $curSheet->setCellValue('B'.$row, $data[steps][$sid][stepDesc]);
         $curSheet->setCellValue('C'.$row, $data[steps][$sid][stepExpe]);
      }

      ob_end_clean();
      //浏览器输出
      header('Content-Type: application/vnd.ms-execl');
      header('Content-Disposition: attachment;filename="'.$data[name].'.xls"');
      header('Cache-Control: max-age=0');
      $writer->save('php://output');
      */

      $filedata = array(
         "
         <style>
            .tdsteps{
               text-align:left;
               padding:5px;
               border-style:none solid solid none;
               border-width:1px;
               border-color:#D0D0D0;

               }
            .xbg{
                  background: #f4f4f4;
              }
         </style>
         <table >
            <tr class='xbg' style='height: 40px;font-weight: bold;'>
               <td class='tdsteps' >No.</td>                               
               <td class='tdsteps' >Description</td>   
               <td class='tdsteps' >Expected Result</td>             
            </tr> 
         "
      );

      $row = 0;
      foreach($data[steps] as $sid => $x1){
         $row++;
         $xbg = "";
         if($row%2 == 0){
            $xbg = " xbg";
         }
         $filedata[] = "
            <tr>
               <td class='tdsteps ".$xbg."' >".encodeHtml($data[steps][$sid][stepNumb])."</td>                               
               <td class='tdsteps ".$xbg."' >".encodeHtml($data[steps][$sid][stepDesc])."</td>   
               <td class='tdsteps ".$xbg."' >".encodeHtml($data[steps][$sid][stepExpe])."</td>             
            </tr> 
         ";
      }

      $filedata[] = "
               <tr>
                  <td colspan=3 class='tdsteps' >".encodeHtml($data[prere])."</td>                                         
               </tr> 
            ";

      $filedata[] = "</table>";

      /*
      ob_end_clean();
      header("Content-Type:application/force-download");
      header("Content-Disposition:attachment;filename=".$data[name]);
      $encoded_filename = urlencode($data[name].".xls");
      $encoded_filename = str_replace("+", "%20", $encoded_filename);
      $ua = $_SERVER["HTTP_USER_AGENT"];
      
      if (preg_match("/MSIE|Edge\/\d+/", $ua)){
          header('Content-Disposition: attachment; filename="' . $encoded_filename . '"');
      }else if(preg_match("/Firefox/", $ua)){
          header('Content-Disposition: attachment; filename*="utf8\'\'' . $data[name].".xls". '"');
      }else{
          header('Content-Disposition: attachment; filename="' . $data[name].".xls" . '"');
      }
      */
      echo join("\n",$filedata);

   }catch(Exception $e){
      echo $e->getMessage();
   }

}else if($queryERR){
   die($queryERR);
}


if($conn){
   mysql_close($conn);
}    

function encodeHtml($str)
{
   $str = preg_replace('/\&/m','&amp;',$str);
   $str = preg_replace('/\</m','&lt;',$str);
   $str = preg_replace('/\>/m','&gt;',$str);
   $str = preg_replace('/\n/m',"<br/>",$str);
   $str = preg_replace('/\s/m',"&nbsp;",$str);

   return $str;
}
?>