(function () {
    chrome.browserAction.setIcon({ path: "img/icon0.png" });//切换图标
    setTimeout(function () {
        var hasWB = false;
        chrome.tabs.getSelected(function (selectedTab) {
            // Retrieves all tabs
            chrome.tabs.getAllInWindow(function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    // Excludes selected and loaded tabs
                    if (tabs[i].id !== selectedTab.id && tabs[i].url.lastIndexOf("weibo.com")) {
                        hasWB = true;
                        break;
                    }
                }
            });
        });

        if (hasWB == true) {
            chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
        }
    }, 10000);
})();
var updateWBADIcon = function (number, STATE) {
    var html = "";
    if (number == 0) {
        number = "";
    }
    if (STATE) {//hidden
        chrome.browserAction.setIcon({ path: "img/icon0.png" });//切换图标
    } else {
        chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
    }
    chrome.browserAction.setBadgeText({ text: String(number) });//提示透明度文字
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {//返回请求数据
    if (request.method == "setWBADicon") {
        var counter = request.number;
        var STATE = request.STATE;
        updateWBADIcon(counter, STATE);
        sendResponse({});
    }
});

chrome.tabs.onRemoved.addListener(function () {
    chrome.browserAction.setIcon({ path: "img/icon0.png" });//切换图标
    chrome.browserAction.setBadgeText({ text: String("") });//提示透明度文字
});//添加监听事件
chrome.tabs.onCreated.addListener(function () {
    var hasWB = false;
    chrome.tabs.getSelected(function (selectedTab) {
        // Retrieves all tabs
        chrome.tabs.getAllInWindow(function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                // Excludes selected and loaded tabs
                if (tabs[i].id !== selectedTab.id && tabs[i].url.lastIndexOf("weibo.com")) {
                    hasWB = true;
                    break;
                }
            }
        });
    });

    if (hasWB == true) {
        chrome.browserAction.setIcon({ path: "img/icon.png" });//切换图标
    }
});//添加监听事件