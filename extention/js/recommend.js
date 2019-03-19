$(document).bind("pageinit", function (){
    var flag = true;
    var i =0;
    //alert(window.localStorage.getItem("usedWBADtag"));
    //TODO:把localstorage数据以及用户id发送到java后台,获取用户推荐
    function sendToJavaBackgroundFriend() {

        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8080/fanfou_Web_exploded/friendRe?para1=" + window.localStorage.getItem("user_id");
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;

            }
        }
        xhr.send();
    }
    //TODO:把localstorage数据以及用户id发送到java后台,获取消息推荐
    function sendToJavaBackgroundFriendTimeLine(referId){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8080/fanfou_Web_exploded/UserTimeLine?para1=" + window.localStorage.getItem("user_id");
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                window.clearInterval(referId);
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;
                $.mobile.hidePageLoadingMsg();
                alert(resp);
            }
        }
        xhr.send();
    }
    function sendToGetLog(){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8080/fanfou_Web_exploded/progress";
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;
                if(resp != null){
                    $("#friendLog").text(resp);
                }
            }
        }
        xhr.send();
    }
    function test(){
        $("#friendLog").text(i++);
    }
    $("#re").unbind("click").bind("click", function (event, ui) {
        sendToJavaBackgroundFriend();
        var referId = window.setInterval(sendToGetLog,3000);
        sendToJavaBackgroundFriendTimeLine(referId);
        $.mobile.loadingMessageTextVisible = true;
        $.mobile.showPageLoadingMsg( 'a', "Please wait..." );
    });




});