   $.ajax({
            url:getRootPath()+"/backstage/insertCustom",
            data:formData,
            type: 'POST',
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success:function(data){
                if(data.code==2000){
                    parent.refresh('iframe8');
                    parent.layer.msg("保存成功",{icon:1});
                    setTimeout(function () {
                        var index=parent.layer.confirm('是否确认创建',{
                            btn:['是','否'] //按钮
                        },function () {
                            parent.layer.close(index);
                            document.project_add.reset();//清理表单缓存
                        },function () {
                            parent.layer.close(index);
                            setTimeout(function () {
                                parent.close_iframe();
                            },1000);
                        });
                    },1000);
                    return false;
                }else {
                    parent.layer.msg(data.message);
                }
            }
        })
    });
    $("#reset").click(function () {
        document.project_add.reset();//清理表单缓存
    });
});