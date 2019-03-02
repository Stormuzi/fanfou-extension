$(document).bind("pageinit", function () {


    //alert(window.localStorage.getItem("usedWBADtag"));
    if (window.localStorage.getItem("usedWBADtag") != "USED") {
        //用户没有用过本插件使用默认配置
        init();
    }
    function init() {
        window.localStorage.clear();
        window.localStorage["selectURA"]= "URA1";//默认选择用户用户算法1
        window.localStorage["selectCRA"]= "CRA1";//默认选择推荐内容算法1
        //先清空
        $("input[type='radio']").attr("checked", false).checkboxradio("refresh");
        $("input[type=checkbox]").attr("checked", false).checkboxradio("refresh");
        $("input[type=checkbox]").checkboxradio('enable').checkboxradio("refresh");
        $("input[type='text']").attr("value","");
        console.log("init done");
    }
    //获取用户id
    function getUserId(){
        //用户登录后先进入http://fanfou.com/home，登录后，爬取用户id
        //从content-script中获取html，抓取用户id
        chrome.tabs.query({active: true},function(tabs) {
            console.log("tabs",tabs);
            console.log("tabs[0].id",tabs[0].id);
            if(tabs[0].url == "http://fanfou.com/home")
            {
                chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {

                    if(response != null){
                        var arr = response.split("/");
                        window.localStorage["user_id"] = arr[3];
                        console.log(arr[3]);
                    }
                });
            }
        });
    }
    getUserId();

    function loadProfile() {//遍历选定配置中已选定的项目
        //TODO: 在load的时候，需要将保存的设定手动写一遍进去，比如参数，选项
        var selectURAtag = 0, selectCRAtag = 0;
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            var value = window.localStorage.getItem(key);
            console.log("key =" +key +" value"+ i +" = " + value);
            if (key == "keyword") {
                $("#keyword").val(value);
                continue;
            }
            if (key == "exkeyword") {
                $("#exkeyword").val(value);
                continue;
            }
            if (key == "selectURA") {
                selectURAtag = 1;
                $("#infoURA input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                if (value == "URA1") {
                    $("#formURA1 input[type='text']").textinput('enable');
                    $("#formURA2 input[type='text']").textinput('disable');
                } else if (value == "URA2") {
                    $("#formURA1 input[type='text']").textinput('disable');
                    $("#formURA2 input[type='text']").textinput('enable');
                }
                continue;
            }

            if (key == "selectCRA") {
                selectCRAtag = 1;
                $("#infoCRA input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                if (value == "CRA1") {
                    $("#formCRA1 input[type='text']").textinput('enable');
                    $("#formCRA2 input[type='text']").textinput('disable');
                } else if (value == "CRA2") {
                    $("#formCRA1 input[type='text']").textinput('disable');
                    $("#formCRA2 input[type='text']").textinput('enable');
                }
                continue;
            }
            //$("#" + value).attr("checked", true).checkboxradio("refresh");
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
            //alert("id=" + window.localStorage[id]);
        } else {
            window.localStorage.removeItem(id);
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
        if (colorvalue == "URA1") {
            $("#formURA1 input[type='text']").textinput('enable');
            $("#formURA2 input[type='text']").textinput('disable');

        } else if (colorvalue == "URA2") {
            $("#formURA1 input[type='text']").textinput('disable');
            $("#formURA2 input[type='text']").textinput('enable');
        }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
    });
    $("#infoCRA input[type='radio']").unbind("click").bind("click", function (event, ui) {
        var colorvalue = $(this).attr("value");
        if ($(this).attr("checked") == "checked") {
            window.localStorage["selectCRA"] = colorvalue;
        } else {
            window.localStorage.removeItem(colorvalue);
        }
        if (colorvalue == "CRA1") {
            $("#formCRA1 input[type='text']").textinput('enable');
            $("#formCRA2 input[type='text']").textinput('disable');
        } else if (colorvalue == "CRA2") {
            $("#formCRA1 input[type='text']").textinput('disable');
            $("#formCRA2 input[type='text']").textinput('enable');
        }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过

    });

    //TODO:当点击推荐页面时，验证参数后将参数读入并写进loadstorage
    $("#submit").unbind("click").bind("click", function (){
        window.localStorage["test"] = $("#URA1para1").val();
        if(window.localStorage.getItem("usedWBADtag") != "USED"){
            //如果没有使用过，则使用默认参数
        }else{
            // 如果是算法1且不为空，则把算法1的参数传递过去，如果是算法2，则把算法2的参数传递过去，否则传递默认值
            // if(window.localStorage.getItem("selectCRA") == "CRA1")
        }


    });


    
});