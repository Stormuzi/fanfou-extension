



// (function () {
//     chrome.browserAction.setIcon({ path: "img/get_started16.png" });//切换图标
//     setTimeout(function () {
//         var hasWB = false;
//         chrome.tabs.getSelected(function (selectedTab) {
//             // Retrieves all tabs
//             chrome.tabs.getAllInWindow(function (tabs) {
//                 for (var i = 0; i < tabs.length; i++) {
//                     // Excludes selected and loaded tabs
//                     if (tabs[i].id !== selectedTab.id && tabs[i].url.lastIndexOf("weibo.com")) {
//                         hasWB = true;
//                         break;
//                     }
//                 }
//             });
//         });

//         if (hasWB == true) {
//             chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
//         }
//     }, 10000);
// })();
// var updateWBADIcon = function (number, STATE) {
//     var html = "";
//     if (number == 0) {
//         number = "";
//     }
//     if (STATE) {//hidden
//         chrome.browserAction.setIcon({ path: "img/icon0.png" });//切换图标
//     } else {
//         chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
//     }
//     chrome.browserAction.setBadgeText({ text: String(number) });//提示透明度文字
// }

// chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {//返回请求数据
//     if (request.method == "setWBADicon") {
//         var counter = request.number;
//         var STATE = request.STATE;
//         updateWBADIcon(counter, STATE);
//         sendResponse({});
//     }
//     if (request.method == "getWBADsmurf") {
//         var smurfs = "$这条微博没有节操,推广来自,微博推广,来自粉丝头条,精彩微博推荐,";//这种肯定是广告
//         var htmlKey = "taobao.com,sinaapp.com,wby.so,url.com,.feitao,emop.cn,pianke.me,tmall.com,taourl.com,51fanli.com,immomo.com,kktalk.com,renrentuan.,zhubajie.com,taoppp.com,weiqc.com,xigouq00.com,wqc.so,likeface.com,event.video.sina.com,event.weibo.com,apps.weibo.com,badge.weibo.com,ua.yesweibo.com,wyht.so,dlj.so,qoo10.cn,weiligongshe.com,fanlibang.com,h2w.iask.cn,acs.56.com,lcpinai.com,lijitui.com,popular_buss,W_no_border,feed_spread_contain,feed_spread,";//默认2013年1月16日17:28:25删除kan.weibo.com,2013年2月17日9:44:37删除vdisk.weibo.comW_no_border,W_no_border:好友关注
//         //feed_spread_contain 屏蔽好友关注微博，有此内容的为此类微博,feed_spread 屏蔽好友关注微博，有此内容的为此类微博
//         var sectionKey = "#pl_content_biztips,div[ad-data],*[node-type^='ad'],.promotion_twist,div[feedtype='ad'],#topicAD";//默认顶部（发布框下方）广告,下部广告(a[suda-uatrack],),v3.6一样
//         var keyWord = "", exKeyword = "", others = "", Box_right = "", all__ = "";//, photostyle = "";
//         for (var i = 0; i < window.localStorage.length; i++) {
//             var key = window.localStorage.key(i);
//             var value = window.localStorage.getItem(key);

//             switch (key) {
//                 //自定义关键字
//                 case "keyword":
//                     keyWord = value;
//                     break;
//                 case "exkeyword":
//                     exKeyword = value;
//                     break;
//                     //微博广告
//                 case "awardRetweet"://有奖转发
//                     smurfs += "$抽奖转发的都是骗子,中奖,奖地址,大奖,仅售,精美礼,奖品,礼品,赢多项奖品,就有机会,有机会获得,幸运粉丝,有奖转发,转发并,的请转发,内转发,同意的转,转发有奖,转发本微博,转发此微博,评论本微博,@3位,@5位,@3名,@5名,好礼,";
//                     break;
//                 case "recommendedFollowing"://推荐关注
//                     smurfs += "$臭不要脸求关注,关注@,推荐@,快来@,终于有人开通,推荐关注,轻松关注,推荐给大家,必须关注,强烈推荐,关注下,喜欢这个微博,喜欢这个帐号,";
//                     break;
//                 case "spread"://好友关注
//                     smurfs += "$好友关注,也关注TA,";
//                     break;
//                 case "promotionalAD"://促销广告
//                     smurfs += "$无耻广告秀下限,地址：t.cn,元起,请点击,大促,周年庆,UGG,爆促销,包邮,卖疯了,详情请点击,全网最低,假一赔,可享受,可免费,免费获,数量有限,可以享受,除痘,正品,到货啦,痘痘,发售,还不赶紧,折起售,优惠！,1折,2折,3折,5折,9折,猪油膏,祛痘,起拍,小肚腩,去黑头,贵宾专线,贵宾热线,";
//                     break;
//                 case "micromsg"://微信推广
//                     smurfs += "$微信推广,微信里也有,微信号,扫描二维码,";
//                     break;
//                 case "groupon"://团购秒杀
//                     smurfs += "$团购秒杀掉节操,折秒杀,元秒杀,团购地址,分享地址,秒杀地址,推荐地址,购买地址,抢购地址,宝贝地址,活动链接,抢货地址,";
//                     break;
//                 case "rebate"://返利网推广
//                     smurfs += "$返利网推广,返利网,省下更多,";
//                     break;
//                 case "invalidWB"://无效微博
//                     smurfs += "$可怜的娃儿被和谐了,此微博已被作者删除,此微博已被删除,此微博不适宜对外公开,";
//                     break;
//                     //其他设置
//                 case "exSelf":
//                     others += value + ",";
//                     break;
					
//                 case "Pl_Core_RightUserGrid__7"://关注/粉丝、微关系
//                     sectionKey += "#Pl_Core_RightUserGrid__7,";
//                     break;
//                 case "Pl_Core_RightPicMulti__8"://微相册
//                     sectionKey += "#Pl_Core_RightPicMulti__8,";
//                     break;
//                 case "Pl_Core_RightTextSingle__12"://话题
//                     sectionKey += "#Pl_Core_RightTextSingle__12,";
//                     break;
//                 case "Pl_Core_RightPicText__13"://热门微博
//                     sectionKey += "#Pl_Core_RightPicText__13,";
//                     break;
//                 case "Pl_Official_RightGrow__15"://勋章信息
//                     sectionKey += "#Pl_Official_RightGrow__15,";
//                     break;
//                 case "Pl_Core_RightRank__21"://可能感兴趣的地方
//                     sectionKey += "#Pl_Core_RightRank__21,";
//                     break;
//                 case "Pl_Core_RightRank__24"://最赞榜（音乐标签）
//                     sectionKey += "#Pl_Core_RightRank__24,";
//                     break;
//                 case "Pl_Core_RightRank__40"://正在热映（电影标签）
//                     sectionKey += "#Pl_Core_RightRank__40,";
//                     break;
					
// 				//XXXX的微博（微博详细内容页）
//                 case "Pl_Core_LeftPicText__5"://赞过
//                     sectionKey += "#Pl_Core_LeftPicText__5,";
//                     break;
//                 case "Pl_Core_RightUserGrid__8"://微关系（我们之间的共同关系）
//                     sectionKey += "#Pl_Core_RightUserGrid__8,";
//                     break;
//                 case "Pl_Core_RightPicMulti__9"://微相册
//                     sectionKey += "#Pl_Core_RightPicMulti__9,";
//                     break;
//                 case "Pl_Core_RightTextSingle__11"://话题
//                     sectionKey += "#Pl_Core_RightTextSingle__11,";
//                     break;
//                 case "Pl_Core_RightPicText__12"://热门微博
//                     sectionKey += "#Pl_Core_RightPicText__12,";
//                     break;
//                 case "Pl_Core_RightRank__20"://可能感兴趣的地方
//                     sectionKey += "#Pl_Core_RightRank__20,";
//                     break;
//                 case "Pl_Core_RightUserList__21"://可能感兴趣的用户
//                     sectionKey += "#Pl_Core_RightUserList__21,";
//                     break;
//                 case "Pl_Core_RightRank__23"://最赞榜（音乐标签）
//                     sectionKey += "#Pl_Core_RightRank__23,";
//                     break;
//                 case "Pl_Core_RightRank__27"://分类榜单（读书标签）
//                     sectionKey += "#Pl_Core_RightRank__27,";
//                     break;
//                 case "Pl_Third_Inline__29"://相关推荐
//                     sectionKey += "#Pl_Third_Inline__29,";
//                     break;
//                 case "Pl_Third_Inline__30"://相关推荐(推荐给你更多更新更好的资讯)
//                     sectionKey += "#Pl_Third_Inline__30,";
//                     break;
//                 case "Pl_Core_RightRank__36"://
//                     sectionKey += "#Pl_Core_RightRank__36,";
//                     break;
//                 case "Pl_Core_RightRank__37"://
//                     sectionKey += "#Pl_Core_RightRank__37,";
//                     break;
					
// 				//企业微博（蓝色大V微博详细内容页）
//                 case "Pl_Core_RightUserGrid__14"://分类榜单/最赞榜(我的微博)
//                     sectionKey += "#Pl_Core_RightUserGrid__14,";
//                     break;
//                 case "Pl_Core_RightTextMulti__15"://媒体标签
//                     sectionKey += "#Pl_Core_RightTextMulti__15,";
//                     break;
//                 case "Pl_Core_RightTextMulti__16"://友情链接
//                     sectionKey += "#Pl_Core_RightTextMulti__16,";
//                     break;
//                 case "Pl_Core_RightRank__17"://预留广告位1
//                     sectionKey += "#Pl_Core_RightRank__17,";
//                     break;
//                 case "Pl_Core_RightPicText__18"://推荐文章
//                     sectionKey += "#Pl_Core_RightPicText__18,";
//                     break;
//                 case "Pl_Core_RightPicMulti__19"://预留广告位3
//                     sectionKey += "#Pl_Core_RightPicMulti__19,";
//                     break;
//                 case "Pl_Core_RightTextSingle__20"://话题(企业微博)
//                     sectionKey += "#Pl_Core_RightTextSingle__20,";
//                     break;
//                 case "Pl_Core_UserGuide__21"://预留广告位4
//                     sectionKey += "#Pl_Core_UserGuide__21,";
//                     break;
//                 case "pl_content_links"://友情链接（旧版）
//                     sectionKey += "#pl_content_links,";
//                     break;
//                 case "pl_leftNav_profilePersonal"://头像区（旧版）
//                     sectionKey += "#pl_leftNav_profilePersonal,";
//                     break;
//                 case "pl_leftNav_profileContent"://导航栏（旧版）
//                     sectionKey += "#pl_leftNav_profileContent,";
//                     break;
//                 case "pl_content_contact"://联系方式（旧版）
//                     sectionKey += "#pl_content_contact,";
//                     break;
//                 case "pl_common_relations"://我们的微关系
//                     sectionKey += "#pl_common_relations,";
//                     break;
//                 case "widget_subscribe_pl_subscribe"://VIP特权
//                     sectionKey += "#widget_subscribe_pl_subscribe,";
//                     break;
//                 case "pl_share_assistant"://助手板块/微客服
//                     sectionKey += "#pl_share_assistant,";
//                     break;
//                 case "pl_content_leaders"://领导版块/创始人/推荐微博
//                     sectionKey += "#pl_content_leaders,";
//                     break;
//                 case "pl_content_subbrands"://部门版块/子部门
//                     sectionKey += "#pl_content_subbrands,";
//                     break;
//                 case "widget_myfans_pl_myfans"://他的粉丝
//                     sectionKey += "#widget_myfans_pl_myfans,";
//                     break;
//                 case "pl_content_staffs"://员工版块/工作人员
//                     sectionKey += "#pl_content_staffs,";
//                     break;
//                 case "pl_content_tags"://自定义标签/企业标签
//                     sectionKey += "#pl_content_tags,";
//                     break;
//                 case "pl_common_feedback"://意见反馈/企业帮助
//                     sectionKey += "#pl_common_feedback,";
//                     break;
					
//                 case "Pl_Third_Inline__29"://相关推荐
//                     sectionKey += "#Pl_Third_Inline__29,";
//                     break;
//                 case "Pl_Third_Inline__30"://相关推荐
//                     sectionKey += "#Pl_Third_Inline__30,";
//                     break;
//                 case "Pl_Core_RightTextSingle__11"://话题
//                     sectionKey += "#Pl_Core_RightTextSingle__11,";
//                     break;
					
//                 case "feed_list_recommend"://屏蔽精彩内容推荐微博
//                     sectionKey += ".WB_feed div[node-type='feed_list_recommend'],";
//                     break;
//                 case "pl_content_top"://屏蔽上册导航条内容
//                     sectionKey += "#pl_content_top,";
//                     break;
//                 case "WB_webim"://屏蔽右侧私信聊天
//                     sectionKey += "#WB_webim,#cometd_uc,.webim_list&.WBIM_fold,";
//                     break;
//                 case "AllRightAD"://右侧所有广告
//                     sectionKey += "#trustPagelet_indexright_recom>div:eq(1)>div:not(:eq(1)),";
//                     break;
//                 case "interest"://可能感兴趣的人
//                     sectionKey += "#trustPagelet_indexright_recom>div:eq(1)>div:eq(1),#trustPagelet_recom_interestv5,#trustPagelete_recom_interest";
//                     break;
//                 case "weiborecom"://微吧推荐
//                     sectionKey += "#trustPagelet_indexright_recom>div:eq(1)>div:eq(2),";
//                     break;
//                 case "zone"://会员专区会员动态
//                     sectionKey += "#trustPagelet_recom_memberv5,#trustPagelet_member_zone,";
//                     break;
//                 case "allinone"://会员专区会员动态
//                     sectionKey += "#trustPagelet_recom_allinonev5,#trustPagelete_recom_allinone,";
//                     break;
//                 case "noticeboard"://公告栏
//                     sectionKey += "#pl_rightmod_noticeboard,";
//                     break;
//                 case "checkin"://签到
//                     sectionKey += "#trustPagelet_checkin_lotteryv5,#trustPagelet_checkin_lottery,";
//                     break;
//                 case "invite"://邀请
//                     sectionKey += "#trustPagelet_checkin_lotteryv5,#trustPagelet_ugrowth_invite,";
//                     break;
//                 case "mood"://心情
//                     sectionKey += "#pl_content_mood,";
//                     break;
//                 case "medal"://勋章
//                     sectionKey += "#pl_rightmod_medal,";
//                     break;
//                 case "oldUser"://旧版微博精选
//                     sectionKey += "#pl_guide_oldUser,";
//                     break;
//                 case "app"://最近使用应用列表
//                     sectionKey += "#pl_leftnav_app,";
//                     break;
//                 case "ads_"://广告
//                     sectionKey += "li[id^='ads'],";
//                     break;
//                 case "ads"://广告
//                     sectionKey += "#pl_rightmod_ads36,#pl_rightmod_ads35,";
//                     break;
//                 case "help"://玩转微博/帮助
//                     sectionKey += "#pl_rightmod_help,";
//                     break;
//                 case "moduleMyRelation"://我的关注和粉丝
//                     sectionKey += "#pl_profile_moduleMyRelation,";
//                     break;
//                 case "pl_profile_giftBox"://我的礼物盒
//                     sectionKey += "#pl_profile_giftBox,.W_layer&.layer_guide,.function_guide&.function_s,.function_guide&.function_h,";
//                     break;
//                 case "pl_profile_hisGiftBox"://他的礼物盒
//                     sectionKey += "#pl_profile_hisGiftBox,.W_layer&.layer_guide,.function_guide&.function_s,.function_guide&.function_h,";
//                     break;
//                 case "pl_profile_unfollow"://不是自己关注用户信息推荐
//                     sectionKey += "#pl_profile_unfollow,";
//                     break;
//                 case "trustPagelet_profile_openApplist"://开启应用卡片 记录你的互联网生活
//                     sectionKey += "#trustPagelet_profile_openApplist,";
//                     break;
//                 case "modulealbum"://个人页面微关系
//                     sectionKey += "#pl_profile_modulealbum,";
//                     break;
//                 case "moduleHisRelation"://个人页面微相册
//                     sectionKey += "#pl_profile_moduleHisRelation,";
//                     break;
//                 case "recomendedkan"://微博详细内容页推荐微刊
//                     sectionKey += "#trustPagelet_mblog_weikan,";
//                     break;
//                 case "hotmblog"://微博详细内容页热门微博
//                     sectionKey += "#trustPagelet_mblog_hotmblog,";
//                     break;
//                 case "weiba"://微博详细内容页推荐微吧
//                     sectionKey += "#trustPagelet_mblog_weiba,";
//                     break;
//                 case "photo"://微博详细内容页推荐图片
//                     sectionKey += "#trustPagelet_mblog_photo,";
//                     break;
//                 case "music"://微博详细内容页推荐音乐
//                     sectionKey += "#trustPagelet_mblog_music,";
//                     break;
//                 case "recommblog"://微博详细内容页推荐微博
//                     sectionKey += "#pl_rightmod_recommblog,";
//                     break;
//                 case "topic"://微博详细内容页推荐话题
//                     sectionKey += "#trustPagelet_mblog_topic,";
//                     break;
//                 case "recomperson"://微博详细内容页推荐关注
//                     sectionKey += "#pl_rightmod_recomperson,";
//                     break;
//                 case "pl_content_commentTopNav"://热评微博
//                     sectionKey += "#pl_content_commentTopNav,";
//                     break;
//                 case "pl_rightmod_feedback"://新浪微博意见反馈
//                     sectionKey += "#pl_rightmod_feedback,";
//                     break;
//                 case "pl_rightmod_helpcommonbox"://共同评论使用小帮助
//                     sectionKey += "#pl_rightmod_helpcommonbox,";
//                     break;
//                 case "pl_rightmod_reportentry"://微博举报处理中心
//                     sectionKey += "#pl_rightmod_reportentry,";
//                     break;
//                 case "pl_rightmod_helpat"://@使用小帮助
//                     sectionKey += "#pl_rightmod_helpat,";
//                     break;
//                 default:
//                     break;
//             }
//         }

//         if (keyWord.lastIndexOf(",") == keyWord.length - 1) {
//             keyWord = keyWord.substring(0, keyWord.length - 1);
//         }
//         sendResponse({
//             keyword: keyWord//可屏蔽关键字
//             , exkeyword: exKeyword//排除关键字
//             , htmlKey: htmlKey//链接广告
//             , smurf: smurfs.substring(0, smurfs.length - 1)//页面广告
//             , others: others.substring(0, others.length - 1)//其他设置，排除自己
//             , photostyle: window.localStorage["photostyle"]//形象设置
//             , sectionKey: sectionKey.substring(0, sectionKey.length - 1)//板块广告
//             , colorvalue: window.localStorage["colorvalue"]//颜色设置
//             , switcher: window.localStorage["switcher"]//开关设置
//             , showOrDelWBADInfo: window.localStorage["showOrDelWBADInfo"]//显示屏蔽微博设置
//             , moreList: window.localStorage["moreList"]//自动展开左侧所有分组
//             , Box_right: window.localStorage["Box_right"]//显示屏蔽微博设置(已关注微博所有的列表)
//             , all__: window.localStorage["all__"]//显示屏蔽微博设置(已关注微博所有的列表)
//             , superScrolling: window.localStorage["superScrolling"]//超级滚动
//             , noforward: window.localStorage["noforward"]//同时转发到我的微博
//         });
//     }
// });

// chrome.tabs.onRemoved.addListener(function () {
//     chrome.browserAction.setIcon({ path: "img/icon0.png" });//切换图标
//     chrome.browserAction.setBadgeText({ text: String("") });//提示透明度文字
// });//添加监听事件
// chrome.tabs.onCreated.addListener(function () {
//     var hasWB = false;
//     chrome.tabs.getSelected(function (selectedTab) {
//         // Retrieves all tabs
//         chrome.tabs.getAllInWindow(function (tabs) {
//             for (var i = 0; i < tabs.length; i++) {
//                 // Excludes selected and loaded tabs
//                 if (tabs[i].id !== selectedTab.id && tabs[i].url.lastIndexOf("weibo.com")) {
//                     hasWB = true;
//                     break;
//                 }
//             }
//         });
//     });

//     if (hasWB == true) {
//         chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
//     }
// });//添加监听事件