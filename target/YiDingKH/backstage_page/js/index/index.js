//获取登录账户信息
$(function () {
    //获取登录态信息验证是否已登录
    $.ajax({
        url:getRootPath()+"/backstage/getInfo",
        dataType: 'json',
        success: function (data) {
            if(data.code==2000){
                $("#managerName").text(data.data.managerName);
                var pStr = "管理员";
                if(data.data.managerPower == 1){
                    pStr = "业务员";
                    $("#addUserLi").hide();
                    $("#deal-all").hide();
                }
                $("#managerPower").text(pStr);
                $("#deal-list").attr("href","data_dist.html?id="+data.data.managerId)
//                    $("#hidden_adviserId").attr("value",data.data.adviserId);
//                    $("#hidden_adviserSummary").attr("value",data.data.adviserSummary);
//                    $("#hidden_adviserPhone").attr("value",data.data.adviserPhone);
//                 $("#hidden_adviserPower").attr("value",data.data.adviserPower);
            }else if(data.code==3002){
                layer.msg(data.message);
                setTimeout(function () {
                    window.location.href=getRootPath()+"/backstage_page/login.html"
                },1000)
            }
        }
    })
//    安全退出功能
    $(".exit_btn").click(function () {
        layer.confirm('是否确定安全退出？', {
            btn: ['是','否'] //按钮
        }, function(){
            $.ajax({
                url:getRootPath()+"/backstage/exit",
                dataType: 'json',
                success:function (data) {
                    if(data.code==2000){
                        layer.msg('安全退出成功');
                        setTimeout(function () {
                            window.location.href=getRootPath()+"/backstage_page/login.html";
                        })
                    }else {
                        layer.msg('安全退出失败');
                    }
                }
            })
        },function () {
            layer.msg('安全退出操作已取消');
        })
    });
})