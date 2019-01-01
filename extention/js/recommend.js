$(document).bind("pageinit", function (){
    //alert(window.localStorage.getItem("usedWBADtag"));
    $("#re").unbind("click").bind("click", function (event, ui) {
        alert("能跨域传递？");
        //alert(window.localStorage.getItem("test"));
    });



    //
    // $("#submit").bind("click", function (event, ui){
    //     alert("message?: DOMString");
    //     $.ajax({
    //         type:"POST",
    //         url:"http://localhost:8091/test?name=li",
    //         success: function(data){
    //             alert(data);
    //         },
    //         error: function(){
    //             //请求出错处理
    //             alert("Error!");
    //         }
    //     });
    // });

});