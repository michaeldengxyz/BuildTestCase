<?php 
error_reporting(0);

function Send_Msg($subject,$emailTo,$HTMLBody,$NotEchoErr,$emailCC)
{    
if(!preg_match('/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i',$emailTo)){
    if(!$NotEchoErr){
        echo("<a style='color:#FF0033'>email address (". $emailTo .') is invalid!</a>');
    }
    return 0;
  } 

if($emailCC){
    if(!preg_match('/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i',$emailCC)){
        if(!$NotEchoErr){
            echo("<a style='color:#FF0033'>email address (". $emailCC .') is invalid!</a>');
        }
        return 0;
    } 
  }
  
echo $HTMLBody."<br />";  //return;
    
require_once("PHPMailer5.2.16/PHPMailerAutoload.php");
$mail = new PHPMailer();  

$mail->SMTPDebug = 0;                               // 3 Enable verbose debug output
$mail->IsSMTP();  
$mail->CharSet = "utf-8";        
$mail->SMTPSecure = "ssl"; 
$mail->SMTPAuth = true;  
                                             
$mail->Host = "smtp.163.com";    
$mail->Port = 465;  
$mail->Username = "kkj_tech@163.com";  
$mail->Password = "TFCAISTWLWSJZAJW";  

$mail->IsHTML(true);
$mail->Subject = $subject;  
$mail->AltBody = "'To view the message, please use an HTML compatible email viewer!'";  
$mail->Body    = $HTMLBody;                
  
$mail->setFrom("kkj_tech@163.com","KKJ Tech");                                       
$mail->addReplyTo("kkj_tech@163.com","KKJ Tech"); 

$user = preg_replace("/\@.*$/i",'',$emailTo);
$mail->addAddress($emailTo,$user); 

if($emailCC){
    $mail->addCC($emailCC);
  }
    
if($mail->Send()) {  
    if(!$NotEchoErr){
        echo "<a style='color:#00CC00'>Email sends successfully to ". $emailTo."</a>";
    }else{
        return 1;
    }
  }else{
    if(!$NotEchoErr){
        echo "<a style='color:#FF0033'>Email fails to send! <br /> ".$mail->ErrorInfo."</a>";
    }else{
        return 0;
    }
  } 
}
?>  