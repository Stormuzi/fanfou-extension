$(document).bind("pageinit", function (){
    //alert(window.localStorage.getItem("usedWBADtag"));
    //TODO:把localstorage数据以及用户id发送到java后台,
    function sendToJavaBackground() {
        //alert(window.localStorage.getItem("test"));
        // xhr.open("POST","http://localhost:8090/test",true);
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // var form = $("#formCRA1");
        // var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8080/fanfou_Web_exploded/test?para1=" + window.localStorage.getItem("user_id");
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;
                alert(resp);
            }
        }
        xhr.send();
    }



    $("#re").unbind("click").bind("click", function (event, ui) {
        sendToJavaBackground();
    });





});