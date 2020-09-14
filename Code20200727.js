// JavaScript Document
var CurrentUserEmail = "";

function CodePanel(isoff)
{
if(isoff){
	$("#divMyAccount").data('on',0).slideUp(200);
	return;
}

if($("#divMyAccount").css('display') == 'none'){
    $("#divMyAccount").data('on',1).slideDown(200,function(){    
          CodeGetEmail();      
          if(CurrentUserEmail){
              $("#divMyAccount div.xclose").show();
              $('#emailaddr').val(CurrentUserEmail);
              $('#span_sendcode').html("You email address: " + CurrentUserEmail + "<br />Login successfully!");
			        $('#div_login').find('td.button.send,td.button.verify').css('color','#C0C0C0');
			        $('#div_login').find('td.button.clean').css('color','#000000');
          }else{
              $('#span_sendcode').html("<a style='color:red'>please login!</a>");
			        $('#div_login').find('td.button.verify,td.button.clean').css('color','#C0C0C0')
          }
       });       
  }else{
    $("#divMyAccount").data('on',0).slideUp(200);
    $('#span_sendcode').html("");
  }
}

function CodeVerify()                                                            
{
$('#span_sendcode').html("<a style='color:#00CC00'>Code validating ...</a>");   

var code = $('#verifyCode').val().replace(/[^0-9]/g,'');
if(!code || (String(code).length < 4)){
    $('#span_sendcode').html("<a style='color:red'>plese input a valid Code</a>");        
    return 0;
  }

var email = $('#emailaddr').val().replace(/\s+/ig,''); 

$.ajax({
    url: 'CodeVerify.php',
    data: {'code':code, 'email':email},
    type: 'GET',
    timeout:120000, 
    dataType: 'text',        
    async: true,
    cache: false,
    success:function(data){
          //console.log('CodeVerify success: ' + data);  
          if(data == 1){
              $('#span_sendcode').html("<a style='color:#00CC00'>Code validating successfully! The webpage will reload in 1 second!</a>"); 
              window.setTimeout(function(){
                location.reload()
                //$("#divMyAccount").data('on',0).slideUp(100);
              },1000); 
          }else if (data == 2){
              location.reload();
          }else{
              $('#span_sendcode').html(data);
              return 0;          
          }            
       },
       
    error:function(XMLHttpRequest, textStatus, errorThrown){            
          $('#span_sendcode').html("<a style='color:red' >Code verification error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus="+ textStatus + "</a>");
       },              
  }); 
}

function CodeSend(_this)                                                              
{
$('#span_sendcode').html("<a style='color:#00CC00'>Sending Code ... ...</a>");

var email = $('#emailaddr').val().replace(/\s+/ig,''); 
$('#emailaddr').val(email);

if(!email){
    $('#span_sendcode').html("<a style='color:red'>Email Address - empty</a>");        
    return;
  }else if(!EmailCheck(email)){
    $('#span_sendcode').html("<a style='color:red'>"+email+": Email Address - is invalid!</a>");        
    return;
  }

$("#divMyAccount div.xclose").hide();

_this.style.visibility = "hidden";
CodeStatus(60,_this);
$.ajax({
    url: 'CodeSend.php',
    data: {'email':email},
    type: 'GET',
    timeout:120000, 
    dataType: 'text',        
    async: true,
    cache: false,
    success:function(data){        
        if(data.match(/Please\s+come\s+back\s+after/i)){
          $('#span_sendcode').html(data);
        }else if(data.match(/Email\s+sends\s+successfully\s+to/i)){
            $('#span_sendcode').html(data + "<div>The code is a 4-digital number, <br />please input to the field [Validation Code], <br />and click [Login]."); 	
            $('#div_login').find('td.button.send,td.button.clean').css('color','#C0C0C0');
            $('#div_login').find('td.button.verify').css('color','#000000');
            $('#verifyCode').focus();
        }else{
            $('#span_sendcode').html(data);
        }
    },
       
    error:function(XMLHttpRequest, textStatus, errorThrown){            
          $('#span_sendcode').html("<a style='color:red' >Get code error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus="+ textStatus + "</a>");
       },              
  }); 
}

function CodeStatus(seconds,_this)
{
    try{
        $("#div_login div.div_count_down2").stop(true,true).css({"width":"100%","border-color":"red"});
    }catch(e){

    }

    seconds = seconds? seconds : 10;
    if(seconds){        
      $("#div_login div.div_count_down2").animate(
            {
            'width': '0%'    
            },
            seconds*1000,
            function(){
              $("#div_login div.div_count_down2").css({"border-color":"#E0E0E0"});
              if(_this){
                  _this.style.visibility = "visible";
              }
            });
    }
}

function CodeClean()
{
$.ajax({
    url: 'CodeClean.php',
    data: {},
    type: 'GET',
    timeout:120000, 
    dataType: 'text',        
    async: true,
    cache: false,
    success:function(data){  
            location.reload();         
       },       
    error:function(XMLHttpRequest, textStatus, errorThrown){            
          $('#span_sendcode').html("<a style='color:red' >Clean code error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus="+ textStatus + "</a>");
       },              
  }); 
}

function CodeGetEmail()
{
$.ajax({
    url: 'CodeGetEmail.php',
    data: {},
    type: 'GET',
    timeout:120000, 
    dataType: 'text',        
    async: false,
    cache: false,
    success:function(data){  
        CurrentUserEmail = data;         
    },
       
    error:function(XMLHttpRequest, textStatus, errorThrown){            
          $('#span_sendcode').html("<a style='color:red' >Clean code error: X.status=" + XMLHttpRequest.status + ", X.readyState=" + XMLHttpRequest.readyState + ", textStatus="+ textStatus + "</a>");
       },              
  }); 
}
