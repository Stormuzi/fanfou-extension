$(document).bind("pageinit", function () {


    //alert(window.localStorage.getItem("usedWBADtag"));
    if (window.localStorage.getItem("usedWBADtag") != "USED") {
        //用户没有用过本插件使用默认配置
        init();
    }
    function init() {
        window.localStorage.clear();
        window.localStorage["selectURA"]= "URA1";//默认选择用户用户算法1
        window.localStorage["URAtop_k"] = 5;
        window.localStorage["CRAtop_k"] = 10;
        window.localStorage["CRAalpha"] = 0.5;
        // window.localStorage["selectCRA"]= "CRA1";//默认选择推荐内容算法1
        $("input[type='radio']").attr("checked", false).checkboxradio("refresh");
        $("input[type=checkbox]").attr("checked", false).checkboxradio("refresh");
        $("input[type=checkbox]").checkboxradio('enable').checkboxradio("refresh");
        $("input[type='text']").attr("value" ,"");
        $("input[type='text']").textinput('enable');
        console.log("init done");
    }
    //获取用户id
    function getUserId(){
        //用户登录后先进入http://fanfou.com/home，登录后，爬取用户id
        //从content-script中获取html，抓取用户id
        chrome.tabs.query({active: true,currentWindow: true},function(tabs) {
            console.log("tabs",tabs);
            console.log("tabs[0].id",tabs[0].id);
            if(tabs[0].url.match("fanfou.com/home"))
            {
                chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
                    if(response != null){
                        var arr = response.split("/");
                        window.localStorage["user_id"] = arr[3];
                        console.log("user_id ",arr[3]);
                    }
                });
            }
        });
    }
    getUserId();
    function set_configured_parameter(){

    }

    function loadProfile() {//遍历选定配置中已选定的项目
        //TODO: 在load的时候，需要将保存的设定手动写一遍进去，比如参数，选项
		$("input[type='text']").textinput('enable');
		if(window.localStorage.getItem("usedWBADtag") == "USED"){
            $("#URAtop_k").val(window.localStorage.getItem("URAtop_k"));
            $("#CRAtop_k").val(window.localStorage.getItem("CRAtop_k"));
            $("#CRAalpha").val(window.localStorage.getItem("CRAalpha"));
        }
        var selectURAtag = 0, selectCRAtag = 0;
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            var value = window.localStorage.getItem(key);
            //console.log("key =" +key +" value"+ i +" = " + value);
            // if (key == "keyword") {
            //     $("#keyword").val(value);
            //     continue;
            // }
            // if (key == "exkeyword") {
            //     $("#exkeyword").val(value);
            //     continue;
            // }
            if (key == "selectURA") {
                selectURAtag = 1;
                $("#infoURA input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                // if (value == "URA1") {
                //     $("#formURA1 input[type='text']").textinput('enable');
                //     $("#formURA2 input[type='text']").textinput('disable');
                // } else if (value == "URA2") {
                //     $("#formURA1 input[type='text']").textinput('disable');
                //     $("#formURA2 input[type='text']").textinput('enable');
                // } else if (value == "URA3") {
                //     $("#formURA1 input[type='text']").textinput('disable');
                //     $("#formURA2 input[type='text']").textinput('enable');
                // }
                continue;
            }
            if(key == "user_id"){
                continue;
            }
            if(key.match("re")){
                continue;
            }
            // if (key == "selectCRA") {
            //     selectCRAtag = 1;
            //     $("#infoCRA input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
            //     if (value == "CRA1") {
            //         $("#formCRA1 input[type='text']").textinput('enable');
            //         $("#formCRA2 input[type='text']").textinput('disable');
            //     } else if (value == "CRA2") {
            //         $("#formCRA1 input[type='text']").textinput('disable');
            //         $("#formCRA2 input[type='text']").textinput('enable');
            //     }
            //     continue;
            // }
            $("#" + value).attr("checked", true).checkboxradio("refresh");
        }
        if (selectURAtag == 0) {//没有勾选，默认显示
            window.localStorage["selectURA"] = "UR1";
            $("input[type='radio'][value='URA1']").attr("checked", true).checkboxradio("refresh");
        }
        if (selectCRAtag == 0) {//没有勾选，默认显示
            window.localStorage["selectCRA"] = "CRA1";
            $("input[type='radio'][value='CRA1']").attr("checked", true).checkboxradio("refresh");
        }
    }
    loadProfile();
	
    $("input[type='checkbox']").unbind("click").bind("click", function (event, ui) {
        var id = $(this).attr("id");
        if ($(this).attr("checked") == "checked") {
            window.localStorage[id] = id;
            // console.log("id=" + window.localStorage[id]);
        } else {
            window.localStorage.removeItem(id);
            // console.log(window.localStorage[id] == null);
        }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
    });

    $("#btnDefault").bind("click", function (event, ui) {
        init();
        loadProfile();
        history.back();
    });

    $("#infoURA input[type='radio']").unbind("click").bind("click", function (event, ui) {
        var colorvalue = $(this).attr("value");
        if ($(this).attr("checked") == "checked") {
            window.localStorage["selectURA"] = colorvalue;
        } else {
            window.localStorage.removeItem(colorvalue);
        }
        // if (colorvalue == "URA1") {
        //     $("#formURA1 input[type='text']").textinput('enable');
        //     $("#formURA2 input[type='text']").textinput('disable');

        // } else if (colorvalue == "URA2") {
        //     $("#formURA1 input[type='text']").textinput('disable');
        //     $("#formURA2 input[type='text']").textinput('enable');
        // }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
    });
    // $("#infoCRA input[type='radio']").unbind("click").bind("click", function (event, ui) {
    //     var colorvalue = $(this).attr("value");
    //     if ($(this).attr("checked") == "checked") {
    //         window.localStorage["selectCRA"] = colorvalue;
    //     } else {
    //         window.localStorage.removeItem(colorvalue);
    //     }
    //     if (colorvalue == "CRA1") {
    //         $("#formCRA1 input[type='text']").textinput('enable');
    //         $("#formCRA2 input[type='text']").textinput('disable');
    //     } else if (colorvalue == "CRA2") {
    //         $("#formCRA1 input[type='text']").textinput('disable');
    //         $("#formCRA2 input[type='text']").textinput('enable');
    //     }
    //     window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过

    // });
    //表单验证,验证top_k参数
    $("#URAtop_k").blur(function(){
    	var r=/^[0-9]*$/; 
		if(!r.test($("#URAtop_k").val())){
			alert("请填写整数数字");
		}else if ($("#URAtop_k").val()<=0||$("#URAtop_k").val()>10) {
			alert("请填写正确的范围");
		}else{
			window.localStorage["URAtop_k"] = $("#URAtop_k").val();
		}
        window.localStorage["usedWBADtag"] = "USED";
    });
    //表单验证,验证top_k参数
    $("#CRAtop_k").blur(function(){
    	var r=/^[0-9]*$/; 
		if(!r.test($("#CRAtop_k").val())){
			alert("请填写整数数字");
		}else if ($("#CRAtop_k").val()<=0||$("#CRAtop_k").val()>15) {
			alert("请填写正确的top_k范围");
		}else{
			window.localStorage["CRAtop_k"] = $("#CRAtop_k").val();
		}
        window.localStorage["usedWBADtag"] = "USED";
    });
    $("#CRAalpha").blur(function(){
    	var r=/^[0-9]+([.]{1}[0-9]+){0,1}$/; 
		if(!r.test($("#CRAalpha").val())){
			alert("请填写数字");
		}else if ($("#CRAalpha").val()<=0||$("#CRAalpha").val()>10) {
			alert("请填写正确的alpha范围");
		}else{
			window.localStorage["CRAalpha"] = $("#CRAalpha").val();
		}
        window.localStorage["usedWBADtag"] = "USED";
    });


    function check_and_set_default_parameter(){
    	if(window.localStorage.getItem("usedWBADtag") != "USED"){
            window.localStorage["URAtop_k"] = 5;
	        window.localStorage["CRAtop_k"] = 10;
	        window.localStorage["CRAalpha"] = 0.5;
        }else{
            // 如果是算法1且不为空，则把算法1的参数传递过去，如果是算法2，则把算法2的参数传递过去，否则传递默认值
            // if(window.localStorage.getItem("selectCRA") == "CRA1")
            if($("#URAtop_k").val()==""||$.trim($("#URAtop_k").val()).length == 0){
            	window.localStorage["URAtop_k"] = 5;
            }
            if($("#CRAtop_k").val()==""||$.trim($("#CRAtop_k").val()).length == 0){
				window.localStorage["CRAtop_k"] = 5;
            }
            if($("#CRAalpha").val()==""||$.trim($("#CRAalpha").val()).length == 0){
            	window.localStorage["CRAalpha"] = 0.5;
            }

        }
    }

    //TODO:当点击推荐页面时，验证参数后将参数读入并写进loadstorage
    $("#submit").unbind("click").bind("click", function (){
		check_and_set_default_parameter();
    });


    
});