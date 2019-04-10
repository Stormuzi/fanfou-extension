$(document).bind("pageinit", function (){
    //加载上一次的推荐结果
    function loadlastRecommendResult(){
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            var value = window.localStorage.getItem(key);
            if(key.match("reUser")){
                var vals = value.split("|");
                var info = vals[0];
                var url = vals[1];
                $("#userResult").append("<li id = '"+ key + "' >" +info+"</li>"); 
                addClickLinsten(key,url);
            }else if (key.match("reTimeLine")) {
                console.log(value);
                var vals = value.split("|");
                var info = vals[0];
                var url = vals[1];
                $("#timelineResult").append("<li id = '"+ key + "' >" +info+"</li>");
                addClickLinsten(key,url);
            }else if (key == "isUserPrivate" && value != null) {
                
            }else if (key == "isUserTimeLinePrivate" && value != null) {
                
            }else{
                continue;
            }
        }
        $("#userResult").listview('refresh');
        $("#timelineResult").listview('refresh');

    }
    loadlastRecommendResult();
    //alert(window.localStorage.getItem("usedWBADtag"));
    //TODO:把localstorage数据以及用户id发送到java后台,获取用户推荐
    function sendToJavaBackgroundFriend() {
        var xhr = new XMLHttpRequest();
        var isUserPrivate = true;
        if(window.localStorage.getItem("isUserPrivate") == null){
            isUserPrivate = false;
        }
        var url = "http://localhost:8090/fanfou_Web_exploded/friendRe?user_id=" + window.localStorage.getItem("user_id") 
            + "&URAtop_k=" + window.localStorage.getItem("URAtop_k") + "&selectURA=" + window.localStorage.getItem("selectURA")
            +"&isUserPrivate=" + isUserPrivate;
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                $.mobile.hidePageLoadingMsg();
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;
				showRecommendationResult(resp,"#userResult");
                //alert(resp)
                // $("#timelineLog").text(ret);
            }
        }
        xhr.send();
    }
    function sendToBackgroundCrawlerTimeline(referId){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8090/fanfou_Web_exploded/crawlerTimeline?user_id=" + window.localStorage.getItem("user_id"); 
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                window.clearInterval(referId);
                $.mobile.hidePageLoadingMsg();
                // JSON解析器不会执行攻击者设计的脚本.
                var ret=xhr.responseText;
                alert(ret);
                // showRecommendationResult(ret,"#timelineResult");
                // $("#timelineLog").text(ret);
            }
        }
        xhr.send();
    }

    //TODO:把localstorage数据以及用户id发送到java后台,获取消息推荐
    function sendToJavaBackgroundFriendTimeLine(){
        var xhr = new XMLHttpRequest();
        var isUserTimeLinePrivate = true;
        if(window.localStorage.getItem("isUserTimeLinePrivate") == null){
            isUserTimeLinePrivate = false;
        }
        var url = "http://localhost:8090/fanfou_Web_exploded/UserTimeLineRe?user_id=" + window.localStorage.getItem("user_id") 
            + "&CRAtop_k=" + window.localStorage.getItem("CRAtop_k") +"&CRAalpha=" +window.localStorage.getItem("CRAalpha")
            +"&isUserTimeLinePrivate=" + isUserTimeLinePrivate;
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                $.mobile.hidePageLoadingMsg();
                // JSON解析器不会执行攻击者设计的脚本.
                var ret=xhr.responseText;
                // alert(ret);
                showRecommendationResult(ret,"#timelineResult");
                // $("#timelineLog").text(ret);
            }
        }
        xhr.send();
       
    }
    function sendToGetLog(){
        var xhr = new XMLHttpRequest();
        var url = "http://localhost:8090/fanfou_Web_exploded/progress";
        xhr.open("GET",url,true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // JSON解析器不会执行攻击者设计的脚本.
                var resp=xhr.responseText;
                if(resp != null){
                    // $("#timelineLog").text(resp);
        			$.mobile.showPageLoadingMsg('e',resp);
                }
            }
        }
        xhr.send();
    }
    //修改插件界面，展示结果
    function showRecommendationResult(resp,ul_id){
        var items = resp.split("|");
        var reg=/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\.|\,|\。|\，|\`|\|/g;
        for (var i = 0; i < items.length -1; i++){
            var item = items[i].split("&");
            var info = item[0];
            var url = item[1];
        
            if(ul_id =="#userResult"){
                $(ul_id).append("<li id = 'reUser"+ i + "' >" +info+"</li>"); 
            }else{
                $(ul_id).append("<li id = 'reTimeLine"+ i + "' ><p><strong>" 
                    + info + "</strong></p></li>"); 
            }
        }
        $(ul_id).listview('refresh');
        for (var i = 0; i < items.length -1; i++){
            var item = items[i].split("&");
            var info = item[0];
            var url = item[1];
            if(ul_id =="#userResult"){
                window.localStorage["reUser" + i] = info + "|" + url;
                addClickLinsten("reUser" + i,url);
            }else{
                window.localStorage["reTimeLine" + i] =info + "|"+ url;
                addClickLinsten("reTimeLine" + i,url);
            }
            
        }
    }
        //为结果添加监听
    function addClickLinsten(li_id,url){ 
        if(url.match("http")){
            // console.log(li_id);
            $("#"+li_id).unbind("click").bind("click", function (event, ui) {
                chrome.tabs.create({url: url,selected:false});
            });
        }
       
    }

    // 清空上次用户推荐
    function clearLastUserRecommend(){
        $('#userResult li').remove()
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            if(key.match("reUser")){
                window.localStorage.removeItem(key);
            }
            
        }
    }
    // 清空上次消息推荐
    function clearLastTimelineRecommend(){
        $('#timelineResult li').remove()
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            if(key.match("reTimeLine")){
                window.localStorage.removeItem(key);
            }    
        }
    }

    // 点击用户推荐后：清空上次推荐，发送请求，处理响应
    $("#reUser").unbind("click").bind("click", function (event, ui) {
    	 // test();
        clearLastUserRecommend();
    	$.mobile.loadingMessageTextVisible = true;
        $.mobile.showPageLoadingMsg( 'a', "Please wait..." );
        sendToJavaBackgroundFriend();
        console.log("user_id:",window.localStorage.getItem("user_id"));
        console.log("URAtop_k:",window.localStorage.getItem("URAtop_k"));
        console.log(window.localStorage.getItem("selectURA"));
    });

    // 点击爬取用户消息
    $("#crawlerTimeLine").unbind("click").bind("click", function (event, ui) {  
        var referId = window.setInterval(sendToGetLog,500);
        $.mobile.loadingMessageTextVisible = true;
        sendToBackgroundCrawlerTimeline(referId);
        console.log("crawler user_id:",window.localStorage.getItem("user_id"));
    });
    //点击推荐消息
    $("#reTimeLine").unbind("click").bind("click", function (event, ui) {
    	//test()
        clearLastTimelineRecommend();
        $.mobile.loadingMessageTextVisible = true;
        $.mobile.showPageLoadingMsg( 'a', "Please wait..." );
        //var referId = window.setInterval(sendToGetLog,500);
        sendToJavaBackgroundFriendTimeLine();
        
        // $.mobile.showPageLoadingMsg( 'a', "Please wait..." );
        console.log("CRAtop_k:",window.localStorage.getItem("CRAtop_k"));
        console.log("CRAalpha:",window.localStorage.getItem("CRAalpha"));

    });
    function test(){
        $("#userResult").append("<li id =\"ttt\"> <a href='www.baidu.com'>baidu </a> </li>");
        $("#userResult").listview('refresh');
    }
});