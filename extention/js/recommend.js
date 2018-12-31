$(document).ready(function(){
    recommend()//执行函数
});
function recommend () {
    alert("能跨域传递？");
    alert(window.localStorage.getItem("test"));
}
$("#submit").bind("click", function (event, ui){
            alert("message?: DOMString");
            $.ajax({
            type:"POST",
            url:"http://localhost:8091/test?name=li",
            success: function(data){
                alert(data);
            },
            error: function(){
                //请求出错处理
                alert("Error!");
            }
        });
});

$(document).bind("pageinit", function () {
 	var xhr = new XMLHttpRequest();
    
    xhr.open("GET","http://localhost:8091/test?name=li",true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON解析器不会执行攻击者设计的脚本.
            var resp=xhr.responseText;
            alert(resp);
        }
    }
    var form = document.getElementById("CRA1para1");
    xhr.send(serialize(form));
	

});