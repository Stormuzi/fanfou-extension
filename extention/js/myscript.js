var html = document.body.innerHTML;
var send = $("#navigation li:eq(1) a:eq(0)").attr("href");
//var send = lis[1].attr("href");
chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello"){
            sendResponse(send);
        }
    });