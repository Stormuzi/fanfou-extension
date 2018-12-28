$(function () {
    'use strict';
    var infos = {
        WBVR: (function () {//获取版本号
            var href = $("#pl_content_top a").eq(0).attr("href");
            try {
                href = href.substr(href.lastIndexOf("wvr=") + 4, 8);
            } catch (e) {
                return "enterprise";
            }
            return href;
        })()

        , WBselector: ".WB_feed[node-type='feed_list']"
        , eachWBselector: ".WB_feed[node-type='feed_list']>div"
        //, gallerySelector: "img[class='bigcursor'][node-type='feed_list_media_bgimg']"

        , theNickName: $("#pl_content_top a[class='gn_name']").text()//自己的名字，下面的判断允许自己微博广告时候用
        , lastADcounter: 0
        , counter: 0
        , ADcounter: 0

        , sectionKey: ""
        , htmlKeys: ""
        , keywords: ""
        , exkeyword: ""
        , others: ""
        , photostyle: ""
        , colorvalue: ""
        , switcher: ""
        , showOrDelWBADInfo: ""
        , moreList: ""
		, superScrolling: ""
		, noforward: ""
        , noforwardMgr: {
            isManualCheck: false
        }
        , Box_right: ""
        , all__: ""
        , W_main_2r: ""

        , hideTimeout: null
        , isAllowScrolling: true//是否滚动完毕，依次判断是否滚动下一个
		, funTimeout: null
		, imgURL: chrome.extension.getURL("img/icon16.png")

        , isFocusOnInput: false//记录焦点在文本框中时不响应上下键滚动

        , superScrollingMgr: {
            lastScrollTop: 0//记录上下滚动的标志
            , duration: 300//滚动时间
            , scrolled: true//是否滚动完毕，依次判断是否滚动下一个
            , fun_detectScroll: null
            , currIndex: 0
            , fun_cruiseScroll: null
			, isManualScroll: false
			, fun_Manual: null
        }

        , fancyMove: {
            isMoving: false
            , X: null
            , Y: null
            , isMouseWheel: false
        }
    }
    $(function () {//微博条目选择器
	
        if (infos.WBVR == 5) {
            infos.WBselector = ".WB_feed[node-type='feed_list']";
            infos.eachWBselector = ".WB_feed[node-type='feed_list']>div[action-type='feed_list_item']";
            //.gallerySelector = "img[class='bigcursor'][node-type='feed_list_media_bgimg']";
        } else {//企业版与3.6版一样
            infos.WBselector = ".feed_lists dl[action-type='feed_list_item']";
            infos.eachWBselector = ".feed_lists dl[action-type='feed_list_item']";
            //infos.gallerySelector = "img[class='bigcursor'][action-type='feed_list_media_img']";
        }
    });
    chrome.extension.sendRequest({ method: "getWBADsmurf" }, function (response) {
        infos.keywords = response.smurf + ",$屏蔽关键词," + response.keyword;
        infos.htmlKeys = response.htmlKey;
        infos.exkeyword = response.exkeyword;
        infos.colorvalue = response.colorvalue;
        infos.switcher = response.switcher;
        infos.showOrDelWBADInfo = response.showOrDelWBADInfo;
        infos.others = response.others;
        infos.photostyle = response.photostyle;
        infos.moreList = response.moreList;
        infos.superScrolling = response.superScrolling;
        infos.noforward = response.noforward;
        infos.Box_right = response.Box_right;
        infos.all__ = response.all__;
        infos.sectionKey = response.sectionKey;
        infos.funTimeout = setTimeout(function () {//修复页面首次载入没有应用设置的效果
            if (infos.switcher == "switcherClosing") {//暂停插件
                return false;
            }

            moreList();
            hideBorder();
            hideAll__();
            $(infos.sectionKey).remove();
            if (infos.superScrolling != null && infos.superScrolling != undefined && infos.superScrolling != "") {
                $(infos.eachWBselector).first().addClass("currWB");
                setTimeout(function () {//2秒后如果没有选择的话选择一个
                    if ($(".currWB").length <= 0) {
                        $(infos.eachWBselector).first().addClass("currWB");
                    }
                }, 3000);
            }

            $(window).scroll();
        }, 1000);
    });
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++取消“同时转发到我的微博”++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    $("input.W_checkbox[type='checkbox'][name='forward']").live("click", function () {//只要单击了复选框设置成已经手动改动过
        infos.noforwardMgr.isManualCheck = true;
    })
    $("textarea.W_input").live('focus', function () {
        $(this).css({ width: "99%" });
        if (infos.noforwardMgr.isManualCheck == false) {//用户已经手动改动过不应用系统设置
            $("input.W_checkbox").attr("checked", false);
        }
    })
    $("a[action-type='feed_list_comment']").live("click", function () {//刚刚展开评论或关闭评论后设置成没有手动改动过
        infos.noforwardMgr.isManualCheck = false;
    });
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++取消“同时转发到我的微博”++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    $(window).scroll(function (event) {
        if (infos.switcher == "switcherClosing") {//暂停插件
            return false;
        }
        if (infos.isAllowScrolling == false) {
            return false;
        }
		
        clearTimeout(infos.funTimeout);
        infos.isAllowScrolling = false;//重置成正在滚动
        infos.funTimeout = setTimeout(function () {
            setTimeout(function () {//两秒钟重置为滚动时可执行
                infos.isAllowScrolling = true;
            }, 1010);
            moreList();
            hideBorder();
            hideAll__();
            $(infos.sectionKey).remove();
            var allItems = $(infos.WBselector).children();//所有微博div
            //infos.WBselector = ".WB_feed[node-type='feed_list']";
            //infos.eachWBselector = ".WB_feed[node-type='feed_list']>div[action-type='feed_list_item']";
		console.log(infos.photostyle+","+infos.WBselector+","+allItems.length+","+infos.counter+","+$("#pl_content_top a").eq(0).attr("href"));
            if (allItems.length > infos.counter) {//有新内容
                infos.counter = $(infos.WBselector).children().length;
                adAnalyzer();
            } else if (allItems.length <= 5 || allItems.length < infos.counter) {
                infos.counter = 0;
                infos.ADcounter = 0;
                infos.lastADcounter = 0;
            }

            (function () {
                //if(infos.lastADcounter<infos.ADcounter){showMenu();}//拦截到新的广告
                //infos.lastADcounter=infos.ADcounter;//记录新的广告数量
                //上面两句附加$("body").prepend(WBADblock);的开头和下面一句互斥
                chrome.extension.sendRequest({ method: "setWBADicon", number: infos.ADcounter }, function (response) { });
            })();

            clearTimeout(infos.superScrollingMgr.fun_cruiseScroll);
            //滚动时绑定屏幕最顶端的微博为当前微博（设置样式：currWB）
            infos.superScrollingMgr.fun_cruiseScroll = setTimeout(function () {
                if (infos.superScrolling != null && infos.superScrolling != undefined && infos.superScrolling != "" && infos.superScrollingMgr.isManualScroll == false) {
                    var $currWB = $(".currWB");
                    if ($currWB.length <= 0) {//没有选中的话选中一个
                        $currWB = $(infos.eachWBselector).first().addClass("currWB");
                    }
                    if ($currWB.height() < $(window).height()
                        || $currWB.height() + $currWB.offset().top < $(document).scrollTop() + $(window).height())//确保$currWB的高度比窗口高度小才行
                    {
                        $(infos.eachWBselector).each(function () {
                            if ($(this).offset().top - 52 > $(document).scrollTop()) {//顶边距在窗口显示区域内或高度比窗口高度大的
                                $currWB.removeClass("currWB");
                                $(this).addClass("currWB");
                                return false;
                            }
                        });
                    }
                }
            }, 100)
        }, 100);
    });
    function moreList() {//显示所有用户分组信息
        if (infos.moreList != null && infos.moreList != undefined && infos.moreList != "") {
            $("#pl_leftnav_group div[node-type=moreList]").show();
            if ($("#pl_leftnav_group div[node-type=moreList]").is(':visible')) {
                infos.moreList = null;//设置为null下次不进入此判断，优化执行速度
            }
        }
    }
    function updateADcount() {
        $("#notification").children().eq(5).html(infos.ADcounter);//.hide(300).show(300).hide(300).show(300).hide(300).show(300);
    }
    function showMenu() {
        updateADcount();
        $("#menu").prop({ checked: true }); hideMenu();
    }
    function hideMenu() {
        clearTimeout(infos.hideTimeout);
        infos.hideTimeout = setTimeout(function () {//隐藏
            $("#menu").prop({ checked: false });
        }, 15000);
    }
    function GetQueryString(name) { //获取地址栏参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function containString(name) { //地址栏中是否包含某参数
        var url = window.location.toString();
        return (url.lastIndexOf(name) >= 0)
    }
    function hideAll__() {
        if (infos.all__ != null && infos.all__ != undefined && infos.all__ != "") {//隐藏所有附加信息板块
            var $test = $("div[id*='__']");
            for (var i = 0; i < $test.length; i++) {
                var id = $test.eq(i).attr("id");
                if (id != "Pl_Official_Header__1" && id != "Pl_Core_Nav__2"//页头
				&& id != "Pl_Core_OwnerFeed__3"//他的主页
				&& id != "Pl_Official_LeftProfileFeedNav__10" && id != "Pl_Official_LeftProfileFeed__11"//微博
				&& id != "Pl_Official_LeftInfo__14"//个人资料
				&& id != "Pl_Official_LeftHisRelation__16"//关注/粉丝
				&& id != "Pl_Third_Inline__18" && id != "Pl_Third_Inline__19"//相册
				&& id != "Pl_Core_LeftPic__32" && id != "Pl_Core_LeftPic__33"//赞
				&& id != "Pl_Official_LeftWeiboDetail__28"//某微博详细页面的微博详情
				&& id != "Pl_Core_MixFeed__13"//微博点评 |此地热议 | 周边热议
				&& id != "Pl_Core_LeftPic__7"//此地热图
				&& id != "Pl_Core_Header__1"//一条微博页面的页头
				&& id != "Pl_Official_LeftWeiboDetail__40"//一条微博页面的微博内容
				
				&& id != "Pl_Official_LeftWeiboDetail__33"//蓝色大V微博详情页
				&& id != "Pl_Core_OwnerFeed__5"//企业微博的微博主页
				&& id != "Pl_Official_LeftProfileFeedNav__27"//企业微博的微博列表栏目
				&& id != "Pl_Official_LeftProfileFeed__28"//企业微博的微博列表
				&& id != "Pl_Core_LeftTextSingle__18"//企业微博的企业资料
				&& id != "Pl_Third_Inline__37"//企业微博的微博相册
				&& id != "Pl_Official_LeftHisRelation__38"//企业微博的微博相册
				&& id != "Pl_Official_LeftWeiboDetail__30"//微博的更多评论页面
				&& id != "Pl_Official_LeftProfileFeedNav__12"//个人微博标签页
				&& id != "Pl_Official_LeftProfileFeed__13"//微博的更多评论页面
				&& id != "Pl_Third_Inline__20"//相册
				&& id != "Pl_Core_LeftPicTextGalley__22"//足迹
				&& id != "Pl_Core_LeftPic__32"//足迹
				&& id != "Pl_Core_LeftPic__33"//足迹
				&& id != "Pl_Core_LeftPicText__34"//足迹
				&& id != "Pl_Core_LeftPicText__35"//足迹
				&& id != "Pl_Core_LeftPicText__36"//足迹
				&& id != "Pl_Core_LeftPic__37"//足迹
				&& id != "Pl_Core_LikesFeed__38"//足迹
				&& id != "Pl_Core_RightRank__39"//足迹
				&& id != "Pl_Core_RightRank__40"//足迹
				
				) {
                    $test.eq(i).hide();
                }
            }
        }
    }
    function hideBorder() {
        if (infos.Box_right != null && infos.Box_right != undefined && infos.Box_right != "") {//隐藏右侧
            //微博主页
            var isAtMe = containString("at")//提到我的分组
			, isFav = containString("fav")//收藏
			, isTome = containString("tome")//发给我的
			, isLeftnav = containString("leftnav")//发给我的
			, ismyfollow = containString("myfollow");//发给我的
            var $pl_rightmod_myinfo = $("#pl_rightmod_myinfo");
            $("#pl_leftnav_common").prepend($pl_rightmod_myinfo);
            $("#Box_right").hide();
            if (isAtMe == true || isFav == true || isTome == true || $("#pl_profile_hisInfo,#pl_profile_myInfo").length > 0) {
                if ($("#plc_main").parent("div").attr("class") != "W_main_a" && $("#pl_profile_hisInfo,#pl_profile_myInfo").length <= 0) {//屏蔽右边栏所有内容（简洁模式）时，要是#plc_main没有在.W_main_a的div里，列表会跑到页面下方，所以用此方法修复。#pl_profile_hisInfo,#pl_profile_myInfo在网页内不需要添加W_main_a
                    $("#plc_main").wrap('<div class="W_main_a"></div>')
                };
                $("#plc_main").css({ "width": "100%" });
                $("dd").css({ "width": "95%" });
            }
            else {
                $("#plc_main").css({ "width": "600px" });
                $("div.WB_screen").css({ "margin": "-9px 0 0 770px" });
            }
            $("#Box_center").css({ "width": "100%" }).find("textarea").css({ "width": "99%" });

            //个人微博，包括自己的和其他人的
            $(".W_main_2r").hide();
            $(".W_main_c,.pf_info_left").css({ "width": "100%" });
            $(".W_main_2r").remove();

            //企业微博
            var $pl_content_litePersonInfo = $("#pl_content_litePersonInfo");
            var $pl_content_myNotice = $("#pl_content_myNotice");
            if ($pl_content_litePersonInfo.length > 0 || $pl_content_myNotice.length > 0) {//$pl_content_myNotice也有 .W_main_r 元素
                $("#pl_leftNav_profilePersonal").append($pl_content_litePersonInfo);
                $("#pl_content_hisFeed").css({ "width": "100%" });
                $("#pl_content_hisFeed").children().eq(1).css({ "width": "100%" });
                $("#pl_content_messPublisher").children().eq(0).css({ "width": "100%" });
                $(".W_main_r").remove();//不放到if里会影响到微博主页个人信息的显示
            }

            //我的关注
            if (ismyfollow == true) {
                //屏蔽右边栏所有内容（简洁模式）时 #plc_main不能有id，同时去掉width属性，否则会截断右边列表
                $("#plc_main").removeAttr("id").css({ "width": "" });
            }

            setTimeout(function () {
                $("#pl_content_messPublisher").children().eq(0).css({ "width": "100%" });//企业微博发布框宽度
                $("#pl_rightmod_myinfo dl").css({ "margin": "0 35px" });
                $("#pl_rightmod_myinfo ul").css({ "width": "200px" });
            }, 1000);
        }
    }
    //去除空格 
    String.prototype.Trim = function () {
        return this.replace(/\s+/g, "");
    }
    //去除换行 
    function clearBr(key) {
        key = key.replace(/<\/?.+?>/g, "");
        key = key.replace(/[\r\n]/g, "");
        return key;
    }
    var adAnalyzer = function () {
        var reason = "", why = "";
        var htmlKey = (infos.htmlKeys).split(',');
        var textKey = (infos.keywords.replace(/，/g, ",").replace(/ /g, ",")).split(',');
        var exKey = (infos.exkeyword.replace(/，/g, ",").replace(/ /g, ",")).split(',');
        var other = (infos.others).split(',');
        $(".WB_face").addClass(infos.photostyle);
        if (other[0] == "exSelf" && $("#pl_profile_nav").text().lastIndexOf("我的主页") >= 0)//允许在个人页面显示自己发布广告
        {
            return false;
        }
        $(infos.WBselector).children().each(function (i)//所有微博div
        {
            var I = i;
            why = "没有原因，这条就是广告";
            i = infos.counter - 1;
            $(infos.WBselector).children().eq(i);//记录this
            if ($(this).attr("isWBAD")) {//已经被处理的广告
                return true;//continue
            }
            var href = $($(this).find('.WB_time')[0]).attr('href'); //当前的微博链接
            var nickName = $($(this).find('.WB_name')[0]).attr('nick-name');
            var nickHref = $($(this).find('.WB_name')[0]).attr('href');
            var html = $(this).html();
            var text = $(this).text().Trim();
            text = text.substring(0, text.lastIndexOf("|举报"));//每条微博截止到“来自新浪微博|  举报”止，否则评论中有屏蔽关键字会导致屏蔽微博，感谢@meOrz报告
            var isad = false;
            for (var j = 0; j < htmlKey.length; j++) {//先检测是否是html广告
                if (html.lastIndexOf(htmlKey[j]) >= 0 && htmlKey[j] != '' && htmlKey[j] != null && htmlKey[j] != undefined && htmlKey[j] != 'undefined') {
                    isad = true;
                    infos.ADcounter++;
                    break;
                }
            }
            if (isad === false) {
                for (var j = 0; j < textKey.length; j++) {//是否文字广告
                    if (textKey[j].lastIndexOf("$") >= 0) {
                        why = (textKey[j].toString()).substring(1, textKey[j].length);
                        continue;
                    }
                    if (text.lastIndexOf(textKey[j]) >= 0 && textKey[j] != '' && textKey[j] != null && textKey[j] != undefined && textKey[j] != 'undefined') {
                        isad = true;
                        infos.ADcounter++;
                        break;
                    }
                }
            }
            for (var j = 0; j < exKey.length; j++) {//是否包含排除关键字
                if (text.lastIndexOf(exKey[j]) >= 0 && exKey[j] != '' && exKey[j] != null && exKey[j] != undefined && exKey[j] != 'undefined') {
                    isad = false;
                    break;
                }
            }
            if (isad === true && infos.showOrDelWBADInfo == "deleteWBAD") {
                $(this).hide(300);
            } else if (isad === true && infos.showOrDelWBADInfo == "showWBAD") {
                if (other[0] == "exSelf" && infos.theNickName == nickName) {//允许在所有微博中显示自己广告
                    isad = false;
                    return true;//continue
                }
                else if (nickHref == undefined) {
                    $(this).prepend("<div style='position: relative;top: -20px;' class='WB_feed_datail S_line2'><div class='S_line1'style='background-color:" + infos.colorvalue + ";position:relative;text-align:center;line-height:28px;position:relative;top:" + (infos.WBVR == 5 ? "5" : "20") + "px;'><img style='position: relative;top: 4px;' src='" + infos.imgURL + "'/>此微博非自主发布，已屏蔽显示&nbsp;<b title='单击工具栏插件图标配置屏蔽选项'>（原因：" + why + "）</b><a href='" + href + "'target='_blank'>查看</a>&nbsp;<a href='javascript:void(0);' for='" + i + "' id='slide" + i + "' class='slideWBAD'>展开</a></div></div><br>").css({ "height": "40px", "overflow": "hidden" }).attr("isWBAD", "true");
                } else {
                    $(this).prepend("<div style='position: relative;top: -20px;' class='WB_feed_datail S_line2'><div class='S_line1'style='background-color:" + infos.colorvalue + ";text-align:center;line-height:28px;position:relative;top:" + (infos.WBVR == 5 ? "5" : "20") + "px;'><img style='position: relative;top: 4px;' src='" + infos.imgURL + "'/><a href='" + nickHref + "' >@" + nickName + "</a>&nbsp;发布的微博广告，已屏蔽显示&nbsp;<b title='单击工具栏插件图标配置屏蔽选项'>（原因：" + why + "）</b><a href='" + href + "'target='_blank'>查看</a>&nbsp;<a href='javascript:void(0);' for='" + i + "' id='slide" + i + "' class='slideWBAD'>展开</a></div></div><br>").css({ "height": "40px", "overflow": "hidden" }).attr("isWBAD", "true");
                }
                $(this).children(".clearfix").addClass("hideArrow");
            }
        });
    }
    $(infos.eachWBselector).live("dblclick", function () {//live()方法的一个不足在于它不支持链式写法，不能这样：$(infos.WBselector).children().live("click", function ()     使用delegate()：$(infos.WBselector).delegate((infos.WBselector.lastIndexOf(".WB_feed") >= 0 ? "div" : "dl"), "click", function () 也不行，使用bind()也不行 --!，使用infos.eachWBselector吧
        if (infos.superScrolling != null && infos.superScrolling != undefined && infos.superScrolling != ""
            && ($(this).attr("iswbad") != "true" || $(this).height() > 90))//不是广告类型或已展开光靠也可以滚动
        {
            $(".currWB").removeClass("currWB");
            $(this).addClass("currWB")
            if ($(this).height() < $(window).height()) {//比窗口高度大的情况下不滚动，否则点击“回复”链接会发生滚动到上边的情况，不合适
                $(".currWB").scrollIntoView({
                    duration: infos.superScrollingMgr.duration
                    , complete: function () { }
                });
            }
        }
    });
    function superScrolling(direction) {
        clearTimeout(infos.superScrollingMgr.fun_Manual);
        infos.superScrollingMgr.isManualScroll = true;
        infos.superScrollingMgr.fun_Manual = setTimeout(function () { infos.superScrollingMgr.isManualScroll = false; }, 1010);

        if (infos.superScrolling != null && infos.superScrolling != undefined && infos.superScrolling != "") {
            var current = $('.currWB').first(),
                targetElt = undefined;
            if (current.length <= 0) {
                current = $(infos.eachWBselector).first().addClass("currWB");
            }

            if (infos.WBVR == 5) {
                targetElt = direction == "down" ? current.next("div[action-type='feed_list_item']") : current.prev("div[action-type='feed_list_item']");
            } else {//企业版与3.6版一样
                targetElt = direction == "down" ? current.next("dl[action-type='feed_list_item']") : current.prev("dl[action-type='feed_list_item']");
            }

            if (direction == "up" && current.prev().is("fieldset")) {//越过fieldset（fieldset标签：“4分钟前，你看到这里”）
                targetElt = current.prev().prev();
            }
            if (direction == "down" && current.next().is("fieldset")) {//越过fieldset（fieldset标签：“4分钟前，你看到这里”）
                targetElt = current.next().next();
            }
            for (var i = 0; i < 50 && (
                (targetElt && targetElt.length)) ; i++) {//循环进入后判断是否隐藏，隐藏的定位到下一个，不进入if的时候不能无限循环下去，每页最多条数45+5条
                current.removeClass("currWB");
                targetElt.addClass("currWB");
                if (targetElt && targetElt.length && targetElt.is(":visible")) {
                    if (targetElt.height() < $(window).height() || direction != "down") {//比窗口高度大的情况下不滚动，或虽然比窗口高度大但是向上滚动时可以滚动，否则点击“回复”链接会发生滚动到上边的情况，不合适
                        targetElt.scrollIntoView({
                            duration: infos.superScrollingMgr.duration
                            , complete: function () { }
                        });
                    }
                    break;
                } else {//隐藏的（选中了“直接删除广告微博”）、fieldset、有新微博
                    current = $('.currWB').first();
                    targetElt = direction == "down" ? current.next("div[action-type='feed_list_item']") : current.prev("div[action-type='feed_list_item']");
                }
            }
        }
        return false;
    }
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 65://a
                if (infos.isFocusOnInput == true) {//焦点在文本框中时不响应上下键滚动
                    break;
                }
            case 38://UP
                superScrolling("up");
                return false;
                break;
            case 90://z
                if (infos.isFocusOnInput == true) {//焦点在文本框中时不响应上下键滚动
                    break;
                }
            case 40://DOWN
                superScrolling("down");
                return false;
                break;
        }
    }
    $("input[type=text],textarea,input[type=password]").live("focus", function () {//记录焦点在文本框之内
        infos.isFocusOnInput = true;
    }).live("blur", function () {//记录焦点离开选中的文本框
        infos.isFocusOnInput = false;
    });

    $(".slideWBAD").live("click", function () {
        if (infos.WBVR == 5) {//5.0版本
            $(this).toggle(function () {
                $(this).html('隐藏')
                .parent().parent().removeClass("WB_feed_datail")
                .siblings(".clearfix").removeClass("hideArrow")
                .parent().css({ "height": "", "overflow": "" }).hide().slideDown(1010);
            },
            function () {
                $(this).html('展开')
                .parent().parent().addClass("WB_feed_datail")
                .siblings(".clearfix").addClass("hideArrow")
                .parent().css({ "overflow": "hidden" }).animate({ "height": "40px" }, 500);
            }).trigger('click');
        } else {//企业版与3.6版一样
            $(this).toggle(function () {
                $(this).html('隐藏')
                .parent().parent().removeClass("WB_feed_datail")
                .parent().removeClass("hideArrow")
                .css({ "height": "", "overflow": "" }).hide().slideDown(1010);
            },
            function () {
                $(this).html('展开')
                .parent().parent().addClass("WB_feed_datail")
                .parent().addClass("hideArrow")
                .css({ "overflow": "hidden" }).animate({ "height": "40px" }, 500);
            }).trigger('click');
        }
    });
    //实现只有激活时候才运行插件
    var getHiddenProp = function () {
        return 'hidden' in document ? 'hidden' : function () {
            var r = null;
            ['webkit', 'moz', 'ms', 'o'].forEach(function (prefix) {
                if ((prefix + 'Hidden') in document) {
                    return r = prefix + 'Hidden';
                }
            });
            return r;
        }();
    }
    var hiddenProp = getHiddenProp();
    document.addEventListener('webkitvisibilitychange', function onVisibilityChange(e) {
        //实现只有激活时候才运行插件      本函数里可千万不能写上alert()，alert一开始执行就要激活，激活就进本函数……
        var state = hiddenProp ? document['webkitVisibilityState'] : hiddenProp;//webkitVisibilityState区分大小写
        //state can be one of 'hidden, visible, prerender, unloaded'
        if (state === 'hidden') {
            chrome.extension.sendRequest({ method: "setWBADicon", number: 0, STATE: state }, function (response) { });
        } else if (state === 'visible') {
            chrome.extension.sendRequest({ method: "setWBADicon", number: infos.ADcounter }, function (response) { });
        }
    });
});