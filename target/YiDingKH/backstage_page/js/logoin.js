
$(function () {
    //已进入先去除已有登录态

    $('#managerPhone').change(function () {
        $('#managerPhone').attr('value',$('#managerPhone').val());
    });
    $('#login').click(function () {
        if($('#managerPhone').val().length==0){
            layer.msg('手机号不能为空');
            return false;
        }else if($('#managerPhone').val().length != 11){
            layer.msg('手机号不正确');
            return false;
        }
        if($('#managerPassword').val().length<6||$('#managerPassword').val().length>8){
            layer.msg('请填写6到8位的密码');
            return false;
        }
        $.ajax({
            type:'POST',
            url:getRootPath()+'/backstage/login',
            data:$('#loginFrom').serialize(),
            async:false,
            dataType:'json',
            success:function(data){
                console.log(data)
                if(data.code==2000){
                    layer.msg("登录成功",{icon:1});
                    setTimeout(function () {
                        window.location.href='index.html';
                    },1000)
                }else {
                    layer.msg(data.message);
                }
                document.loginFrom.reset();//清理表单缓存
            }
        })
    });
});