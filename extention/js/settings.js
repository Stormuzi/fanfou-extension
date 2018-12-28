$(document).bind("pageinit", function () {
    if (window.localStorage.getItem("usedWBADtag") != "USED") {
        //用户没有用过本插件使用默认配置
        init();
    }
    function init(resource) {
        window.localStorage.clear();
        if (resource == "btnDefault") {//不清空usedWBADtag
            window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
        };
        window.localStorage["showOrDelWBADInfo"] = "deleteWBAD";
        window.localStorage["selectURA"]= "URA1";
        window.localStorage["selectCRA"]= "CRA1";
    }

    function loadProfile() {//遍历选定配置中已选定的项目
        $("input[type=checkbox]").attr("checked", false).checkboxradio("refresh");
        $("input[type=checkbox]").checkboxradio('enable').checkboxradio("refresh");
        //$("input[type=text]").attr("checked", false);

        var colortag = 0, deletetag = 0, styletag = 0, switchertag = 0, selectURAtag = 0, selectCRAtag = 0;
        for (var i = 0; i < window.localStorage.length; i++) {
            var key = window.localStorage.key(i);
            var value = window.localStorage.getItem(key);
            console.log("value=" + value);
            if (key == "keyword") {
                $("#keyword").val(value);
                continue;
            }
            if (key == "exkeyword") {
                $("#exkeyword").val(value);
                continue;
            }
            if (key == "showOrDelWBADInfo") {
                deletetag = 1;
                
                $("#infosett input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                if (value == "showWBAD") {
                    $("#collsett input[type='radio']").checkboxradio('enable').checkboxradio("refresh");
                } else if (value == "deleteWBAD") {
                    $("#collsett input[type='radio']").checkboxradio('disable').checkboxradio("refresh");
                }
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
                    $("#formURA1 input[type='text']").textinput('enable');
                    $("#formURA2 input[type='text']").textinput('disable');
                }
                continue;
            }
            if (key == "photostyle") {
                styletag = 1;
                $("#photo_style input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                continue;
            }
            if (key == "colorvalue") {
                colortag = 1;
                $("#collsett input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                continue;
            }
            if (key == "switcher") {
                switchertag = 1;
                $("#switcher input[type='radio'][value='" + value + "']").attr("checked", true).checkboxradio("refresh");
                continue;
            }
            $("#" + value).attr("checked", true).checkboxradio("refresh");
        }
        if (deletetag == 0) {//没有勾选，默认显示
            window.localStorage["showOrDelWBADInfo"] = "showWBAD";
            $("input[type='radio'][value='showWBAD']").attr("checked", true).checkboxradio("refresh");
        }
         if (selectCRAtag == 0) {//没有勾选，默认显示
            window.localStorage["selectCRA"] = "CRA1";
            $("input[type='radio'][value='CRA1']").attr("checked", true).checkboxradio("refresh");
        }
        if (selectURAtag == 0) {//没有勾选，默认显示
            window.localStorage["selectURA"] = "UR1";
            $("input[type='radio'][value='URA1']").attr("checked", true).checkboxradio("refresh");
        }
  
      
    }
    loadProfile();
    $("input[type='checkbox']").bind("click", function (event, ui) {
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
        init("btnDefault");
        loadProfile();
        history.back();
    });
    $("#collsett input[type='radio']").bind("click", function (event, ui) {
        var colorvalue = $(this).attr("value");
        if ($(this).attr("checked") == "checked") {
            window.localStorage["colorvalue"] = colorvalue;
        }
        else {
            window.localStorage.removeItem(colorvalue);
        }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
    });
    $("#infosett input[type='radio']").bind("click", function (event, ui) {
        var colorvalue = $(this).attr("value");
        if ($(this).attr("checked") == "checked") {
            window.localStorage["showOrDelWBADInfo"] = colorvalue;
        } else {
            window.localStorage.removeItem(colorvalue);
        }

        if (colorvalue == "showWBAD") {
            $("#collsett input[type='radio']").checkboxradio('enable').checkboxradio("refresh");
        } else if (colorvalue == "deleteWBAD") {
            $("#collsett input[type='radio']").checkboxradio('disable').checkboxradio("refresh");
        }
        window.localStorage["usedWBADtag"] = "USED";//记录下用户已经使用过
        //选中：$("input[type='checkbox']").attr("checked", true).checkboxradio("refresh");
        //不选：$("input[type='checkbox']").attr("checked", false).checkboxradio("refresh");
    });
    $("#infoURA input[type='radio']").bind("click", function (event, ui) {
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
    $("#infoCRA input[type='radio']").bind("click", function (event, ui) {
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
            var xhr = new XMLHttpRequest();
            xhr.open("GET","http://localhost:8091/test?name=li",true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    // JSON解析器不会执行攻击者设计的脚本.
                    var resp=xhr.responseText;
                    alert(resp);
                }
            }
            var form = $("formCRA1");
            var formData = new FormData(form);
            xhr.send(formData);
        
    });
    
});