    // console.log(socket)
    var MessageMap = null;
    var chatTime = null;
    var sentMessageMap;
    function setUserInfo() {
        $.ajax({
            type : 'POST',
            url : '/chatUser/getVisitor',
            dataType: 'json',
            async : true,
                success: function(data) {
                    console.log("获取用户信息...");
                    console.log(data)
                    if (data.code == 2000) {
                        var userInfo = data.data;
                        userId = userInfo.visitorId;
                        $("#username").html(userInfo.visitorName);
                        $('#adv_ul').html("");
                        $("#avatarUrl").attr("src", "./static/img/avatar/Member001.jpg");
                        // var friendListHTML = "";
                        var adviserListHTML= "";
                        var friendList = new Array();
                        MessageMap = data.adviserInfoMap;
                        sentMessageMap = new SentMessageMap();
                        for(var key in data.adviserInfoMap){
                            friendList.unshift(data.adviserInfoMap[key]);
                            sentMessageMap.put(key, new Array());
                        }
                        console.log(friendList)
                        if(friendList.length > 0 ){
                            for (var i = 0; i < friendList.length; i++) {
                                console.log(friendList[i])
                                // if(userId != friendList[i].managerId){
                                    // friendListHTML +=
                                    //     '<li data-c="0">' +
                                    //     '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
                                    //     '<div class="liRight">' +
                                    //     '<span class="hidden-userId">' + friendList[i].managerId + '</span>' +
                                    //     '<span class="intername">' + friendList[i].managerName + '</span>' +
                                    //     '<span class="infor"></span>' +
                                    //     '</div>' +
                                    //     '</li>';
                                    adviserListHTML +='<li class="adv_li" data-index="'+i+'">\n' +
                                        '                <div class="adv_li_head"><img src="static/img/avatar/Member001.jpg"/></div>\n' +
                                        '                <div class="adv_li_info"><span class="adv_name">' + friendList[i].managerName +' <i class="adv_position">高级置业顾问</i></span></div>\n' +
                                        '            </li>'
                                // }
                            }

                        }else{
                            adviserListHTML +="<li class=\"adv_li_no\">\n" +
                                "                <img class=\"no_img\" src=\"static/img/nobody.png\">\n" +
                                "                <p class=\"no_txt\">暂无客服在线</p>\n" +
                                "            </li>"
                        }

                        // 设置好友列表
                        // $('.conLeft ul').append(friendListHTML);
                        $('#adv_ul').html(adviserListHTML);
                        // 绑定好友框点击事件
                        // $('.conLeft ul li').on('click', friendLiClickEvent);
                        $('#adv_ul li').on('click', showChatBox);

                        ws.register();
                    } else {
                        alert(data.message);
                        // window.location.href="login.html";
                    }
                }
        });
    }
    
    
    // function setSentMessageMap() {
    //
    // }
    
    var ws = {
        register: function() {
            if (!window.WebSocket) {
                  return;
            }
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "userId" : userId,
                    "type" : "REGISTER_USER"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        getHistory: function(adviserId) {
            if (!window.WebSocket) {
                return;
            }
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "userId" : userId,
                    "adviserId":adviserId,
                    "type" : "GET_HISTORY"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        singleSendForStart: function(fromUserId, toUserId, content) {
            if (!window.WebSocket) {
                return;
            }
            console.log(socket)
            console.log(WebSocket.OPEN)
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    "content" : content,
                    "type" : "SINGLE_FIRST_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        singleSendProduct: function(fromUserId, toUserId,type,buildId,title,url,price) {
            if (!window.WebSocket) {
                return;
            }
            console.log(socket)
            console.log(WebSocket.OPEN)
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    // "content" : content,
                    "msgType" : type,
                    "productId" : buildId,
                    "productName" : title,
                    "productImg" : url,
                    "productPrice" : price,
                    "type" : "SINGLE_PRODUCT_USER"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        singleSendForStart: function(fromUserId, toUserId, content) {
            if (!window.WebSocket) {
                return;
            }
            console.log(socket)
            console.log(WebSocket.OPEN)
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    "content" : content,
                    "type" : "SINGLE_FIRST_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        singleSend: function(fromUserId, toUserId, content) {
            if (!window.WebSocket) {
                  return;
            }
            console.log(socket)
            console.log(WebSocket.OPEN)
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    "content" : content,
                    "type" : "SINGLE_SENDING_USER"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        
        groupSend: function(fromUserId, toGroupId, content) {
            if (!window.WebSocket) {
                  return;
            }
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toGroupId" : toGroupId,
                    "content" : content,
                    "type" : "GROUP_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        
        fileMsgSingleSend: function(fromUserId, toUserId, originalFilename, fileUrl, fileSize) {
            if (!window.WebSocket) {
                  return;
            }
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    "originalFilename" : originalFilename,
                    "fileUrl" : fileUrl,
                    "fileSize" : fileSize,
                    "type" : "FILE_MSG_SINGLE_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        
        fileMsgGroupSend: function(fromUserId, toGroupId, originalFilename, fileUrl, fileSize) {
            if (!window.WebSocket) {
                  return;
            }
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toGroupId" : toGroupId,
                    "originalFilename" : originalFilename,
                    "fileUrl" : fileUrl,
                    "fileSize" : fileSize,
                    "type" : "FILE_MSG_GROUP_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        
        registerReceive: function(json) {
            // console.log("userId为 " + userId + " 的用户登记到在线用户表成功！");
            // $('.conLeft ul').html("");
            // var friendListHTML = "";
            var adviserListHTML = "";
            $('#adv_ul').html("");
            // $('.conLeft ul').html("");
            var friendList = new Array();
            MessageMap = json.adviserInfoMap;
            sentMessageMap = new SentMessageMap();

            for(var key in json.adviserInfoMap){
                friendList.unshift(json.adviserInfoMap[key]);
                sentMessageMap.put(key, new Array());
            }
            console.log(friendList)
            if(friendList.length > 0 ){
                for (var i = 0; i < friendList.length; i++) {
                    console.log(friendList[i])
                    if(userId != friendList[i].managerId){
                        // friendListHTML +=
                        //     '<li data-c="0">' +
                        //     '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
                        //     '<div class="liRight">' +
                        //     '<span class="hidden-userId">' + friendList[i].managerId + '</span>' +
                        //     '<span class="intername">' + friendList[i].managerName + '</span>' +
                        //     '<span class="infor"></span>' +
                        //     '</div>' +
                        //     '</li>';
                        adviserListHTML +="<li class=\"adv_li\">\n" +
                            "                <div class=\"adv_li_head\"><img src=\"static/img/avatar/Member001.jpg\"></div>\n" +
                            "                <div class=\"adv_li_info\"><span class=\"adv_name\">" + friendList[i].managerName +" <i class=\"adv_position\">高级置业顾问</i></span></div>\n" +
                            "            </li>"
                    }
                }
            }else{
                adviserListHTML +="<li class=\"adv_li_no\">\n" +
                    "                <img class=\"no_img\" src=\"static/img/nobody.png\">\n" +
                    "                <p class=\"no_txt\">暂无客服在线</p>\n" +
                    "            </li>"
            }

            // 设置好友列表
            // $('.conLeft ul').append(friendListHTML);
            $('#adv_ul').append(adviserListHTML);
            // 绑定好友框点击事件
            // $('.conLeft ul li').on('click', friendLiClickEvent);
            $('#adv_ul li').on('click', showChatBox);
        },
        
        singleReceive: function(data,managerDto) {
            // 获取、构造参数
            console.log(data);
            var fromUserId = data.formId;
            var content = data.content;
            var fromAvatarUrl;
            var $receiveLi;
            $('.conLeft').find('span.hidden-userId').each(function(){
                if (this.innerHTML == fromUserId) {
                    fromAvatarUrl = $(this).parent(".liRight")
                        .siblings(".liLeft").children('img').attr("src");
                    $receiveLi = $(this).parent(".liRight").parent("li");
                }
            })
            var answer='';
            answer += '<li>' +
                        '<div class="answers">'+ content +'</div>' +
                        '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
                    '</li>';

            // 消息框处理     
            processMsgBox.receiveSingleMsg(answer, fromUserId);
            // 好友列表处理
            processFriendList.receiving(content, $receiveLi);

            //聊天框被隐藏时 执行
            if($(".qqBox").is(':hidden')){
                var html = '<div class="tip-toast" style="bottom:2rem;">\n' +
                    '        <div style="display: inline-block;">\n' +
                    '            <img style="border-radius: 2rem;" src="static/img/avatar/Member001.jpg">\n' +
                    '        </div>\n' +
                    '        <div style="display: inline-block;vertical-align: middle;color: #fff;">\n' +
                    '            <div>'+managerDto.managerName +'<span style="font-size:1.2rem">'+data.date.substring(10,19)+'</span></div>\n' +
                    '            <div>'+content+' <a onclick="showBox()">点击查看</a></div>\n' +
                    '        </div>\n' +
                    '    </div>'
                $("#toastList").append(html);
            }
        },
        showHistory: function(data,historyMap) {
            // 获取、构造参数
            console.log(data);
            //历史记录、当前用户ID
            var fromUserId = data.formId;
                var content = data.content;
                var date = data.date;
                chatTime = data.date;
                var fromAvatarUrl;
                var $receiveLi;
                $('.conLeft').find('span.hidden-userId').each(function(){
                    if (this.innerHTML == fromUserId) {
                        fromAvatarUrl = $(this).parent(".liRight")
                            .siblings(".liLeft").children('img').attr("src");
                        $receiveLi = $(this).parent(".liRight").parent("li");
                    }
                })
                // var dateStr = judgeDate(date);
                // console.log(dateStr)
                // var answer='';
                // answer += '<li class="time-li"><span>'+dateStr+'</span></li><li>' +
                //     '<div class="answers">'+ content +'</div>' +
                //     '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
                //     '</li>';

                // 消息框处理
                // processMsgBox.receiveFirstSingleMsg(answer, fromUserId);
                // 好友列表处理
                // processFriendList.receiving(content, $receiveLi);
            showHistoryList(historyMap,userId,data.formId);
            // if(  data.content != ""){
            //
            //
            // }
        },
        singleFirstReceive: function(data,historyMap,managerDto) {
            // 获取、构造参数
            console.log(data);
            //历史记录、当前用户ID

            showHistoryList(historyMap,userId,data.formId);
            if(  data.content != ""){

                var fromUserId = data.formId;
                var content = data.content;
                var date = data.date;
                chatTime = data.date;
                var fromAvatarUrl;
                var $receiveLi;
                $('.conLeft').find('span.hidden-userId').each(function(){
                    if (this.innerHTML == fromUserId) {
                        fromAvatarUrl = $(this).parent(".liRight")
                            .siblings(".liLeft").children('img').attr("src");
                        $receiveLi = $(this).parent(".liRight").parent("li");
                    }
                })
                var dateStr = judgeDate(date);
                console.log(dateStr)
                var answer='';
                answer += '<li class="time-li"><span>'+dateStr+'</span></li><li>' +
                    '<div class="answers">'+ content +'</div>' +
                    '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
                    '</li>';

                // 消息框处理
                processMsgBox.receiveFirstSingleMsg(answer, fromUserId);
                // 好友列表处理
                processFriendList.receiving(content, $receiveLi);
            }
            //聊天框被隐藏时 执行
            if($(".qqBox").is(':hidden')){
                var html = '<div class="tip-toast" style="bottom:2rem;">\n' +
                    '        <div style="display: inline-block;">\n' +
                    '            <img style="border-radius: 2rem;" src="static/img/avatar/Member001.jpg">\n' +
                    '        </div>\n' +
                    '        <div style="display: inline-block;vertical-align: middle;color: #fff;">\n' +
                    '            <div>'+managerDto.managerName +'<span style="font-size:1.2rem">'+data.date.substring(10,19)+'</span></div>\n' +
                    '            <div>'+content+' <a onclick="showBox()">点击查看</a></div>\n' +
                    '        </div>\n' +
                    '    </div>'
                $("#toastList").append(html);
            }
        },
        offlineReceive:function(data){
            console.log(data);
            var fromUserId = data.toId;
            var content = data.content;
            var fromAvatarUrl;
            var $receiveLi;
            $('.conLeft').find('span.hidden-userId').each(function(){
                if (this.innerHTML == fromUserId) {
                    fromAvatarUrl = $(this).parent(".liRight")
                        .siblings(".liLeft").children('img').attr("src");
                    $receiveLi = $(this).parent(".liRight").parent("li");
                }
            })
            var date =  new Date();
            var dateStr = date.getHours()+":"+(date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes())+":"+(date.getSeconds()<10? '0'+date.getSeconds():date.getSeconds());
            var answer='';
            content = "抱歉，若我未能及时看到信息请留下”称呼+手机号”，我会第一时间跟您联系！";
            // answer += '<li style="text-align: center;"><span style="color: #AAAAAA;padding: 5px;border-radius: 10px;">该客服目前不在线</span></li>';
            answer += '<li style="text-align: left;display: flex;">' +
                '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: top;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
                '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ dateStr +'</div>'+
                '<div class="answers" style="display: inline-block;width: auto;float:none;width: 70%;">'+content+'</div></div >' +
                '</li>';
            sentMessageMap.get(fromUserId).push(answer);
            $(".RightCont ul").append(answer);
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
            // 消息框处理
            // processMsgBox.receiveOfflineSingleMsg(answer, fromUserId);
            // 好友列表处理
            processFriendList.receiving(content, $receiveLi);

        },
        groupReceive: function(data) {
            // 获取、构造参数
            console.log(data);
            var fromUserId = data.fromUserId;
            var content = data.content;
            var toGroupId = data.toGroupId;
            var fromAvatarUrl;
            var $receiveLi;
            $('.conLeft').find('span.hidden-userId').each(function(){
                if (this.innerHTML == fromUserId) {
                    fromAvatarUrl = $(this).parent(".liRight")
                        .siblings(".liLeft").children('img').attr("src");
                    /* $receiveLi = $(this).parent(".liRight").parent("li"); */
                }
            })
            $('.conLeft').find('span.hidden-groupId').each(function(){
                if (this.innerHTML == toGroupId) {
                    $receiveLi = $(this).parent(".liRight").parent("li");
                }
            })
            var answer='';
            answer += '<li>' +
                        '<div class="answers">'+ content +'</div>' +
                        '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
                    '</li>';
                    
            // 消息框处理   
            processMsgBox.receiveGroupMsg(answer, toGroupId);
            // 好友列表处理
            processFriendList.receiving(content, $receiveLi);
        },
        
        fileMsgSingleRecieve: function(data) {
            // 获取、构造参数
            console.log(data);
            var fromUserId = data.fromUserId;
            var originalFilename = data.originalFilename;
            var fileSize = data.fileSize;
            var fileUrl = data.fileUrl;
            var content = "[文件]";
            var fromAvatarUrl;
            var $receiveLi;
            $('.conLeft').find('span.hidden-userId').each(function(){
                if (this.innerHTML == fromUserId) {
                    fromAvatarUrl = $(this).parent(".liRight")
                        .siblings(".liLeft").children('img').attr("src");
                    $receiveLi = $(this).parent(".liRight").parent("li");
                }
            })
            var fileHtml = 
            '<li>'+
                '<div class="receive-file-shown">' + 
                    '<div class="media">' +
                        '<div class="media-body"> ' +
                            '<h5 class="media-heading">' + originalFilename + '</h5>' +
                            '<span>'+ fileSize + '</span>' +
                        '</div>' +
                        '<a href="' + fileUrl + '" class="media-right">' +
                            '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' + 
                        '</a>' + 
                    '</div>'+
                '</div>' +
                '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
            '</li>';
                    
            // 消息框处理     
            processMsgBox.receiveSingleMsg(fileHtml, fromUserId);
            // 好友列表处理
            processFriendList.receiving(content, $receiveLi);
        },
        
        fileMsgGroupRecieve: function(data) {
            // 1. 获取、构造参数
            console.log(data);
            var fromUserId = data.fromUserId;
            var toGroupId = data.toGroupId;
            var originalFilename = data.originalFilename;
            var fileSize = data.fileSize;
            var fileUrl = data.fileUrl;
            var content = "[文件]";
            var fromAvatarUrl;
            var $receiveLi;
            $('.conLeft').find('span.hidden-userId').each(function(){
                if (this.innerHTML == fromUserId) {
                    fromAvatarUrl = $(this).parent(".liRight")
                        .siblings(".liLeft").children('img').attr("src");
                    /* $receiveLi = $(this).parent(".liRight").parent("li"); */
                }
            })
            $('.conLeft').find('span.hidden-groupId').each(function(){
                if (this.innerHTML == toGroupId) {
                    $receiveLi = $(this).parent(".liRight").parent("li");
                }
            })
            var fileHtml = 
            '<li>'+
                '<div class="receive-file-shown">' + 
                    '<div class="media">' +
                        '<div class="media-body"> ' +
                            '<h5 class="media-heading">' + originalFilename + '</h5>' +
                            '<span>'+ fileSize + '</span>' +
                        '</div>' +
                        '<a href="' + fileUrl + '" class="media-right">' +
                            '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' + 
                        '</a>' + 
                    '</div>'+
                '</div>' +
                '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
            '</li>';
                    
            // 2. 消息框处理     
            processMsgBox.receiveGroupMsg(fileHtml, toGroupId);
            // 3. 好友列表处理
            processFriendList.receiving(content, $receiveLi);
        },
        
        remove: function() {
            socket.close();
        }
    };
    function showChatBox(json) {
        console.log($(this).index())
        var i = $(this).index();
        var is_have = false;
        $(".qqBox").show();
        // var friendListHTML = "";
        var friendList = new Array();
        for (var key in MessageMap) {
            friendList.unshift(MessageMap[key]);
        }
        console.log($(".conLeft ul li").length)
        for (var j = 0; j < $(".conLeft ul li").length; j++) {
            if ($(".conLeft ul li").eq(j).find(".hidden-userId").text() == friendList[i].managerId) {
                is_have = true;
                var obj = $(".conLeft ul li").eq(j).clone(true);
                $(".conLeft ul li").eq(j).remove();
                $(".conLeft ul").prepend(obj);
                $(".conLeft ul li").removeClass("bg");
                $(".conLeft ul li").first().addClass("bg");
                break;
            }
        }
        if(!is_have){

            $('.conLeft ul li').removeClass('bg');
            var friendListHTML =
                '<li class="bg" data-c="0">' +
                '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
                '<div class="liRight">' +
                '<span class="hidden-userId">' + friendList[i].managerId + '</span>' +
                '<span class="intername">' + friendList[i].managerName + '</span>' +
                '<span class="infor"></span>' +
                '</div>' +
                '</li>';
            $('.conLeft ul').append(friendListHTML);
            $('.conLeft ul li').on('click', friendLiClickEvent);
            console.log($(this).find(".adv_name").text().split(" ")[0])
            console.log(friendList[i].managerId);
            friendBottomLiClickEvent(friendList[i].managerName, friendList[i].managerId);
            ws.getHistory(friendList[i].managerId)
        }
        // if(!is_have){
        //     $('.conLeft ul li').removeClass('bg');
        //     var friendListHTML =
        //         '<li class="bg" data-c="0">' +
        //         '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
        //         '<div class="liRight">' +
        //         '<span class="hidden-userId">' + friendList[i].managerId + '</span>' +
        //         '<span class="intername">' + friendList[i].managerName + '</span>' +
        //         '<span class="infor"></span>' +
        //         '</div>' +
        //         '</li>';
        //     $('.conLeft ul').append(friendListHTML);
        //     $('.conLeft ul li').on('click', friendLiClickEvent);
        //     friendBottomLiClickEvent(friendList[i].managerName,friendList[i].managerId);
        // }else{
        //
        //     var id=friendList[i].managerId;
        //     // var messageArray = sentMessageMap.get(toUserId);
        //     // console.log("toUserId",toUserId)
        //     // console.log("sentMessageMap",sentMessageMap)
        //     // console.log("sentMessageMap.get(toUserId)",sentMessageMap.get(toUserId))
        //     //
        //     // console.log("messageArray",messageArray)
        //     $('#toUserId').val(id);
        //     console.log("sentMessageMap.get(id)",sentMessageMap.get(id))
        //     $(".RightCont .newsList").html("");
        //     $(".conRight .headName").text($(this).find(".adv_name").text().split(" ")[0]);
        //     for(var i = 0 ; i <sentMessageMap.get(id).length;i++){
        //         $(".RightCont .newsList").append(sentMessageMap.get(id)[i]);
        //     }
        //     // for (var i = 0; i < messageArray.length; i++) {
        //     //     $('.newsList').append(messageArray[i]);
        //     // }
        //     console.log("id",id)
        //     ws.singleSendForStart(id,userId,"")
        // }


    }
    function buildShowChatBox(obj) {
        console.log($(obj).data("name"))
        var adviserName = $(obj).data("name")
        var adviserId = $(obj).data("id")
        var title = $(obj).data("tit")
        var price = $(obj).data("price")
        var buildId = $(obj).data("buildid")
        var type = $(obj).data("type");
        var url = $(obj).data("url")
        var content = "["+(type == 'build' ? '楼盘':'二手房')+"信息] "+title;

        // var i = $(this).index();
        var is_have = false;
        $(".qqBox").show();
        // // var friendListHTML = "";
        var friendList = new Array();
        for (var key in MessageMap) {
            friendList.unshift(MessageMap[key]);
        }
        console.log($(".conLeft ul li").length)
        for (var j = 0; j < $(".conLeft ul li").length; j++) {
            if ($(".conLeft ul li").eq(j).find(".hidden-userId").text() == adviserId) {
                is_have = true;
                var obj = $(".conLeft ul li").eq(j).clone(true);
                $(".conLeft ul li").eq(j).remove();
                $(".conLeft ul").prepend(obj);
                $(".conLeft ul li").removeClass("bg");
                $(".conLeft ul li").first().addClass("bg");
                break;
            }
        }
        if($(".qqBox").is(':hidden') || !is_have){

            $('.conLeft ul li').removeClass('bg');
            var friendListHTML =
                '<li class="bg" data-c="0">' +
                '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
                '<div class="liRight">' +
                '<span class="hidden-userId">' + adviserId + '</span>' +
                '<span class="intername">' + adviserName + '</span>' +
                '<span class="infor">'+(content.length>8 ? content.substring(0, 8) + "..." : content)+'</span>' +
                '</div>' +
                '</li>';
            $('.conLeft ul').append(friendListHTML);
            $('.conLeft ul li').on('click', friendLiClickEvent);
            // console.log($(this).find(".adv_name").text().split(" ")[0])
            // console.log(adviserId);

            // ws.getProduct(adviserId,type,buildId,title,url,price);

        }else{
            // 好友列表处理
            processFriendList.receiving(content, obj);
        }
        friendTabLiClickEvent(adviserName, adviserId,type,buildId,title,url,price);

        // if(!is_have){
        //     $('.conLeft ul li').removeClass('bg');
        //     var friendListHTML =
        //         '<li class="bg" data-c="0">' +
        //         '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
        //         '<div class="liRight">' +
        //         '<span class="hidden-userId">' + friendList[i].managerId + '</span>' +
        //         '<span class="intername">' + friendList[i].managerName + '</span>' +
        //         '<span class="infor"></span>' +
        //         '</div>' +
        //         '</li>';
        //     $('.conLeft ul').append(friendListHTML);
        //     $('.conLeft ul li').on('click', friendLiClickEvent);
        //     friendBottomLiClickEvent(friendList[i].managerName,friendList[i].managerId);
        // }else{
        //
        //     var id=friendList[i].managerId;
        //     // var messageArray = sentMessageMap.get(toUserId);
        //     // console.log("toUserId",toUserId)
        //     // console.log("sentMessageMap",sentMessageMap)
        //     // console.log("sentMessageMap.get(toUserId)",sentMessageMap.get(toUserId))
        //     //
        //     // console.log("messageArray",messageArray)
        //     $('#toUserId').val(id);
        //     console.log("sentMessageMap.get(id)",sentMessageMap.get(id))
        //     $(".RightCont .newsList").html("");
        //     $(".conRight .headName").text($(this).find(".adv_name").text().split(" ")[0]);
        //     for(var i = 0 ; i <sentMessageMap.get(id).length;i++){
        //         $(".RightCont .newsList").append(sentMessageMap.get(id)[i]);
        //     }
        //     // for (var i = 0; i < messageArray.length; i++) {
        //     //     $('.newsList').append(messageArray[i]);
        //     // }
        //     console.log("id",id)
        //     ws.singleSendForStart(id,userId,"")
        // }


    }
    function showHistoryList(list,userId,fromId){
        console.log("showHistoryList",list)
        $(".conRight").show();
        var html='';
        if(!$.isEmptyObject(list)){
            for(var key in list){
            // for(var i = 0 ; i < list.length ; i++){
                if(list[key].formId == userId){
                    html += '<li style="text-align: right;">' +
                        '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ list[key].date +'</div>'+
                        '<div class="news" style="display: inline-block;width: auto;float:none;">'+ list[key].content +'</div></div >' +
                        '<div class="nesHead" style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member001.jpg"/></div>' +
                        '</li>';
                }else{
                    html += '<li style="text-align: left;">' +
                        '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
                        '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ list[key].date +'</div>'+
                        '<div class="answers" style="display: inline-block;width: auto;float:none;">'+ list[key].content +'</div></div >' +
                        '</li>';
                }

            }
            html += '<div style="text-align: center;color: #bdbdbd;" >以上均为历史信息</div> <hr>';
            // 消息框处理
            // processMsgBox.receiveFirstSingleMsg(html, userId);
            console.log(sentMessageMap);
            console.log(fromId);

            sentMessageMap.get(fromId).push(html);
            $(".RightCont ul").html(html);
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
        }
    }
    function logout() {
        // alert("聊天框消失")
        $(".qqBox").hide();
        // 1. 关闭websocket连接
        // ws.remove();
        //
        // // 2. 注销登录状态
        // $.ajax({
        //     type : 'POST',
        //     url : '/chat/exit',
        //     dataType: 'json',
        //     async : true,
        //     success: function(data) {
        //         if (data.status == 200) {
        //             // 3. 注销成功，进行页面跳转
        //             console.log("注销成功！");
        //             window.location.href="login.html";
        //         } else {
        //             alert(data.msg);
        //         }
        //     }
        // });
    }
    function showBox(){
        $(".qqBox").show();
        $(this).remove();
    }
    function getLogList(page){
        var visitorId = userId;
        var managerId = $('#toUserId').val();

        $.ajax({
            type : 'POST',
            url : getRootPath()+'/chat/getLogByID',
            dataType: 'json',
            data : {
                managerId: managerId,
                visitorId: visitorId,
                page:page,
                size:10
            },
            async : false,
            success: function(data) {
                console.log(data)
                if (data.code == 2000) {
                    $("#historyBox").html("");
                    var manager = data.managerDto;
                    var visitor = data.visitorDto;
                    var html = "";
                    if(data.data.list.length > 0 ){

                        for(var i = 0 ; i < data.data.list.length ; i++){
                            //logType 1 客服>用户  0 反之
                            if(data.data.list[i].logType == 0){
                                html += '<li style="text-align: right;">' +
                                    '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.data.list[i].logDate +'</div>'+
                                    '<div class="news" style="display: inline-block;width: auto;float:none;">'+ data.data.list[i].logContent +'</div></div >' +
                                    '<div class="nesHead" style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member001.jpg"/></div>' +
                                    '</li>';
                            }else{
                                html += '<li style="text-align: left;">' +
                                    '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
                                    '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.data.list[i].logDate +'</div>'+
                                    '<div class="answers" style="display: inline-block;width: auto;float:none;">'+ data.data.list[i].logContent +'</div></div >' +
                                    '</li>';
                            }
                        }

                    }else{
                        html+="<li><div>暂无聊天记录</div></li>";
                    }
                    $("#historyBox").append(html);
                    $(".historyList").show();
                } else {
                    alert(data.message);
                }
            }
        });
    }
    function closeHistory(){
        $(".historyList").hide();
    }
    $(".myfile").fileinput({
        uploadUrl:"chatroom/upload",
        uploadAsync : true, //默认异步上传
        showUpload : true, //是否显示上传按钮,跟随文本框的那个
        showRemove : false, //显示移除按钮,跟随文本框的那个
        showCaption : false,//是否显示标题,就是那个文本框
        showPreview : true, //是否显示预览,不写默认为true
        dropZoneTitle: "请通过拖拽图片文件放到这里",
        dropZoneEnabled : false,//是否显示拖拽区域，默认不写为true，但是会占用很大区域
        maxFileSize: 30720,//单位为kb，如果为0表示不限制文件大小
        maxFileCount : 1, //表示允许同时上传的最大文件个数
        enctype : 'multipart/form-data',
        validateInitialCount : true,
        previewFileIcon : "<i class='glyphicon glyphicon-file'></i>",
        msgFilesTooMany : "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
        language : 'zh'
    })
    //异步上传返回结果处理
    $('.myfile').on('fileerror', function(event, data, msg) {
        console.log("fileerror");
        console.log(data);
    });
    //异步上传返回结果处理
    $(".myfile").on("fileuploaded", function(event, data, previewId, index) {
        
        // 1. 上传成功1.5秒后自动关闭上传模态框
        console.log("fileuploaded");
        setTimeout(function() {
            $('#upload-cancel').trigger('click');
            $('.fileinput-remove').trigger('click');
        }, 1500);
        
        // 2. 获取、设置参数
        var returnData = data.response.data;
        var originalFilename = returnData.originalFilename;
        var fileSize = returnData.fileSize;
        var fileUrl = returnData.fileUrl;
        var content = "[文件]";
        var fromUserId = userId;
        var avatarUrl = $('#avatarUrl').attr("src");
        var $sendLi = $('.conLeft').find('li.bg');
        var toUserId = $('#toUserId').val();
        var toGroupId = $('#toGroupId').val();
        var fileHtml = 
            '<li>'+
                '<div class="send-file-shown">' + 
                    '<div class="media">' +
                        '<a href="' + fileUrl + '" class="media-left">' +
                            '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' + 
                        '</a>' + 
                        '<div class="media-body"> ' +
                            '<h5 class="media-heading">' + originalFilename + '</h5>' +
                            '<span>'+ fileSize + '</span>' +
                        '</div>' +
                    '</div>'+
                '</div>' +
                '<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
            '</li>';
        
        // 3. 发送信息到服务器        
        if (toUserId.length != 0) {
            ws.fileMsgSingleSend(fromUserId, toUserId, originalFilename, fileUrl, fileSize);
        } else {
            ws.fileMsgGroupSend(fromUserId, toGroupId, originalFilename, fileUrl, fileSize);
        }
        
        // 4. 消息框处理： 
        processMsgBox.sendFileMsg(fileHtml, toUserId, toGroupId);
        
        // 5. 好友列表处理
        processFriendList.sending(content, $sendLi);
    });

    //上传前
    $('.myfile').on('filepreupload', function(event, data, previewId, index) {
        console.log("filepreupload");
    });	

	// 绑定发送按钮回车事件
	$('#dope').keydown(function(e) {
		if (e.keyCode == 13) {
			$('.sendBtn').trigger('click');
			e.preventDefault(); //屏蔽enter对系统作用。按后增加\r\n等换行
		}
	});
	
	// 绑定发送按钮点击事件
	$('.sendBtn').on('click',function(){
		var fromUserId = userId;
		var toUserId = $('#toUserId').val();
		var toGroupId = $('#toGroupId').val();
		console.log(toUserId)
		var news = $('#dope').val();
		if (toUserId == '' && toGroupId == '') {
			alert("请选择对话方");
			return;
		}
		if(news == ''){
			alert('消息不能为空');
			return;
		} else {
			if (toUserId.length != 0) {
                // console.log("fromUserId",fromUserId)
                // console.log("toUserId",toUserId)
                // console.log("news",news)

                ws.singleSend(fromUserId, toUserId, news);
			} else {
				ws.groupSend(fromUserId, toGroupId, news);
			}
            var nowTime = new Date();
			var lastTime = new Date(chatTime);
            chatTime = nowTime;
            console.log(chatTime)
            var date3=nowTime.getTime()-lastTime.getTime();
            var mins = Math.floor(date3/(1000*60));
			$('#dope').val('');			
			var avatarUrl = $('#avatarUrl').attr("src");
			var msg = '';
			var timeStr = '';
			if(mins > 5){
			    timeStr = nowTime.getHours()+":"+(nowTime.getMinutes() < 10 ? "0"+nowTime.getMinutes() : nowTime.getMinutes());
                msg += '<li class="time-li"><span>'+timeStr+'</span></li>'
            }
			msg += '<li>'+
					'<div class="news">' + news + '</div>' +
					'<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
				'</li>';
			console.log(msg)
			// 消息框处理：
			processMsgBox.sendMsg(msg, toUserId)
					
			// 好友列表处理：
			var $sendLi = $('.conLeft').find('li.bg');
			processFriendList.sending(news, $sendLi);
		}
	})
	
	$('.ExP').on('mouseenter',function(){
		$('.emjon').show();
	})
	
	$('.emjon').on('mouseleave',function(){
		$('.emjon').hide();
	})
	
	$('.emjon li').on('click',function(){
		var imgSrc=$(this).children('img').attr('src');
		$('.emjon').hide();
		var fromUserId = userId;
		var toUserId = $('#toUserId').val();
		var toGroupId = $('#toGroupId').val();
		var content  = '<img class="Expr" src="' + imgSrc + '">';
		if (toUserId == '' && toGroupId == '') {
			alert("请选择对话方");
			return;
		}
		if (toUserId.length != 0) {
		    ws.singleSend(fromUserId, toUserId, content);
		} else {
			ws.groupSend(fromUserId, toGroupId, content);
		}
		var avatarUrl = $('#avatarUrl').attr("src");
		var msg = '';
		msg += '<li>'+
				'<div class="news">' + content + '</div>' +
				'<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
			'</li>';
		processMsgBox.sendMsg(msg, toUserId);
		var $sendLi = $('.conLeft').find('li.bg');
		content = "[图片]";
		processFriendList.sending(content, $sendLi);
	})
    $('#fastReply ').on('change',function(){
        // var imgSrc=$(this).children('img').attr('src');
        // $('.emjon').hide();
        console.log($(this).val())
        var txt = $(this).val();
        var fromUserId = userId;
        var toUserId = $('#toUserId').val();
        var toGroupId = $('#toGroupId').val();
        // var content  = '<img class="Expr" src="' + imgSrc + '">';
        // if (toUserId == '' && toGroupId == '') {
        if (toUserId == '') {
            alert("请选择对话方");
            return;
        }
        // if (toUserId.length != 0) {
        ws.singleSend(fromUserId, toUserId, txt);
        // } else {
        //     ws.groupSend(fromUserId, toGroupId, content);
        // }
        var avatarUrl = $('#avatarUrl').attr("src");
        var msg = '';
        msg += '<li>'+
            '<div class="news">' + txt + '</div>' +
            '<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
            '</li>';
        processMsgBox.sendMsg(msg, toUserId);
        var $sendLi = $('.conLeft').find('li.bg');
        var content = txt.substring(0, 8) + "...";
        processFriendList.sending(content, $sendLi);
    })
	// 好友框点击事件
	function friendLiClickEvent(e){
		console.log($(this).hasClass("bg"))
        if(!$(this).hasClass("bg")){
            // 1. 设置点击阴影效果
            $(this).addClass('bg').siblings().removeClass('bg');

            // 2. 设置显示右侧消息框
            $('.conRight').css("display", "-webkit-box");

            // 3. 设置消息框显示对方信息，清空对方id
            var intername=$(this).children('.liRight').children('.intername').text();
            var toUserId = $(this).children('.liRight').children('.hidden-userId').text();
            // var toGroupId = $(this).children('.liRight').children('.hidden-groupId').text();
            /*alert('userId:' + (toUserId.length != 0));
            alert('groupId:' + toGroupId);*/
            $('.internetName').text(intername);
            $('#toUserId').val("");
            // $('#toGroupId').val("");

            // 4. 设置显示已收到的信息，设置好对方的id
            $('.newsList').html('');
            var messageArray;
            console.log("toUserId" ,toUserId)
            console.log("sentMessageMap" , sentMessageMap)
            if (toUserId.length != 0) {
                messageArray = sentMessageMap.get(toUserId);
                $('#toUserId').val(toUserId);
            } else {
                messageArray = sentMessageMap.get(toGroupId);
                $('#toGroupId').val(toGroupId);
            }
            console.log("messageArray",messageArray)
            for (var i = 0; i < messageArray.length; i++) {
                console.log("messageArray[i]",messageArray[i])
                console.log("i",i)
                $('.newsList').append(messageArray[i]);
            }

            // 5.设置消息框滚动条滑到底部
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );


        }
        // 6. 去掉红色提醒徽章
        var $badge = $(this).find(".layui-badge");
        if ($badge.length > 0) {
            $badge.remove();
        }

		// ws.singleSendForStart(toUserId,userId,"您好，我是"+intername+"，请问有什么能帮到您？")
	}
    // 好友框标签点击事件
    function friendTabLiClickEvent(intername,toUserId,type,buildId,title,url,price){
        // console.log(e)
        // 1. 设置点击阴影效果
        $(this).addClass('bg').siblings().removeClass('bg');

        // 2. 设置显示右侧消息框
        $('.conRight').css("display", "-webkit-box");

        // 3. 设置消息框显示对方信息，清空对方id
        // var intername=$(this).children('.liRight').children('.intername').text();
        // var toUserId = $(this).children('.liRight').children('.hidden-userId').text();
        // var toGroupId = $(this).children('.liRight').children('.hidden-groupId').text();
        /*alert('userId:' + (toUserId.length != 0));
        alert('groupId:' + toGroupId);*/
        $('.internetName').text(intername);
        $('#toUserId').val("");
        // $('#toGroupId').val("");

        // 4. 设置显示已收到的信息，设置好对方的id
        $('.newsList').html('');
        var messageArray;
        // console.log(sentMessageMap[toUserId])
        // if (toUserId.length != 0) {
        // messageArray = sentMessageMap.get(toUserId);
        if(!sentMessageMap.get(toUserId)){
            sentMessageMap.put(toUserId,new Array());

        }
        messageArray = sentMessageMap.get(toUserId);
        console.log(toUserId)
        $('#toUserId').val(toUserId);
        // } else {
        //     messageArray = sentMessageMap.get(toGroupId);
        //     $('#toGroupId').val(toGroupId);
        // }
        var date =  new Date();
        var dateStr = date.getHours()+":"+(date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes())+":"+(date.getSeconds()<10? '0'+date.getSeconds():date.getSeconds());
        var msg = '<li style="text-align: right;">' +
            '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ dateStr +'</div>'+
            '<div class="news" style="display: inline-block;width: auto;float:none;"><a style="display: inline-flex;"><div><img src="'+url+'" style="width: 124px;height: 84px;margin: 10px;"></div><div style="width: 200px;padding-top: 5px;"><p style="font-size: 18px;font-weight: bolder;">'+title+'</p><p style="margin: 10px 0;">'+price+'</p><p>'+price+'</p></div></a></div></div >' +
            '<div class="nesHead" style="display: inline-block;float:none;vertical-align: top;"><img src="./static/img/avatar/Member001.jpg"/></div>' +
            '</li>';
        console.log(messageArray)
        messageArray.push(msg);
        for (var i = 0; i < messageArray.length; i++) {
            $('.newsList').append(messageArray[i]);
        }

        // 5.设置消息框滚动条滑到底部
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );

        // 6. 去掉红色提醒徽章
        var $badge = $(this).find(".layui-badge");
        if ($badge.length > 0) {
            $badge.remove();
        }
        ws.singleSendProduct(userId,toUserId,type,buildId,title,url,price);
    }
    // 好友框底部点击事件
    function friendBottomLiClickEvent(intername,toUserId){
        // console.log(e)
        // 1. 设置点击阴影效果
        $(this).addClass('bg').siblings().removeClass('bg');

        // 2. 设置显示右侧消息框
        $('.conRight').css("display", "-webkit-box");

        // 3. 设置消息框显示对方信息，清空对方id
        // var intername=$(this).children('.liRight').children('.intername').text();
        // var toUserId = $(this).children('.liRight').children('.hidden-userId').text();
        // var toGroupId = $(this).children('.liRight').children('.hidden-groupId').text();
        /*alert('userId:' + (toUserId.length != 0));
        alert('groupId:' + toGroupId);*/
        $('.internetName').text(intername);
        $('#toUserId').val("");
        // $('#toGroupId').val("");

        // 4. 设置显示已收到的信息，设置好对方的id
        $('.newsList').html('');
        var messageArray;
        // console.log(sentMessageMap[toUserId])
        // if (toUserId.length != 0) {
            messageArray = sentMessageMap.get(toUserId);
            console.log(toUserId)
            $('#toUserId').val(toUserId);
        // } else {
        //     messageArray = sentMessageMap.get(toGroupId);
        //     $('#toGroupId').val(toGroupId);
        // }
        for (var i = 0; i < messageArray.length; i++) {
            $('.newsList').append(messageArray[i]);
        }

        // 5.设置消息框滚动条滑到底部
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );

        // 6. 去掉红色提醒徽章
        var $badge = $(this).find(".layui-badge");
        if ($badge.length > 0) {
            $badge.remove();
        }

        // ws.singleSendForStart(toUserId,userId,"您好，我是"+intername+"，请问有什么能帮到您？")
    }
	
	// 处理消息框的对象，统一管理相关处理函数，主要包括4个事件函数：
	// (实际上应该有8个事件函数，发送得4个：单发普通信息、群发普通信息、单发文件信息、群发文件信息，
	// 再加上对应的接收4个，但根据实际情况，发现代码可重用，于是便缩减为4个)
	// 1. sendMsg: 发送(单个、群)消息时，调用此函数处理消息框变化；
	// 2. sendFileMsg： 文件上传成功后，发送(单个、群)文件消息时，调用此函数处理消息框变化；
	// 3. receiveSingleMsg： 收到单发(普通对话、文件)消息时，调用此函数处理消息框变化；
	// 4. receiveGroupMsg： 收到群发(普通对话、文件)消息时，调用此函数处理消息框变化。
	var processMsgBox = {
			sendMsg: function(msg, toUserId) {
				// 1. 把内容添加到消息框
				$('.newsList').append(msg);
				
				// 2. 手动计算、调整回显消息的宽度
				var $newsDiv = $('.newsList li').last().children("div").first();
				var fixWidth = 300; // 自定义的消息框本身的最长宽度
				var maxWidth = 493; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
				var minMarginLeftWidth = 224; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
				var marginLeftWidth; // 要计算消息框的margin-left宽度
				if ($newsDiv.actual('width') < fixWidth) {
					marginLeftWidth = maxWidth - $newsDiv.actual('width');;
					$newsDiv.css("margin-left", marginLeftWidth + "px");
				} else {
					$newsDiv.css("width", fixWidth + "px")
					        .css("margin-left", minMarginLeftWidth + "px");
				}
				var htmlStr = "";
				if(msg.indexOf("time-li") > -1 ){
				    htmlStr = $('.newsList div.time-li').last().prop("outerHTML") + $('.newsList li').last().prop("outerHTML")
                }else{
                    htmlStr = $('.newsList li').last().prop("outerHTML")
                }
				// 3. 把 调整后的消息html标签字符串 添加到已发送用户消息表
				// if (toUserId.length != 0) {
                    sentMessageMap.get(toUserId).push(htmlStr);
				// } else {
				// 	sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
				// }
				
				// 4. 滚动条往底部移
				$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
			},
			
			sendFileMsg: function(msg, toUserId, toGroupId) {
				// 注意，文件信息消息框不需要计算宽度，已通过css设置好固定的样式
				// 1. 回显发送的新消息
				$('.newsList').append(msg);
				
				// 2. 把消息html标签字符串 添加到已发送用户消息表
				if (toUserId.length != 0) {
		            sentMessageMap.get(toUserId).push($('.newsList li').last().prop("outerHTML"));
		        } else {
		            sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
		        }
				
				// 3. 消息框往下移
				$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
			},
			
			receiveSingleMsg: function(msg, fromUserId) {
				// 1. 设置消息框可见
				$('.conRight').css("display", "-webkit-box"); 
				console.log(msg)
				// 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
				$('.newsList-temp').append(msg);
				var $focusUserId = $(".conLeft .bg").find('span.hidden-userId');
                console.log($focusUserId.length)
				if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
					$('.newsList').append(msg);
				}
		        
		        // 3. 利用暂存区手动计算、调整新消息的宽度；
		        var $answersDiv = $('.newsList-temp li').last().children("div").first();
		        var fixWidth = 300; // 消息框本身的最长宽度
		        var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
		        var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
		        var marginRightWidth; // 要计算消息框的margin-right宽度
		        if ($answersDiv.actual('width') < fixWidth) {
                    console.log(4)
		            marginRightWidth = maxWidth - $answersDiv.actual('width');
		            $answersDiv.css("margin-right", marginRightWidth + "px");
		            if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
		                $('.newsList li').last().children("div").first()
		                    .css("margin-right", marginRightWidth + "px");
		            }
		        } else {
		            console.log(5)
		            $answersDiv.css("width", fixWidth + "px")
		                       .css("margin-right", minMarginRightWidth + "px");
		            if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
		                $('.newsList li').last().children("div").first()
		                    .css("width", fixWidth + "px")
		                    .css("margin-right", minMarginRightWidth + "px");
		            }
		        }
		        console.log(sentMessageMap.get(fromUserId))
                console.log(fromUserId)
                console.log(sentMessageMap)

                // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区
		        sentMessageMap.get(fromUserId).push($('.newsList-temp li').last().prop("outerHTML"));
		        $('.newsList-temp').empty();
		        
		        // 5. 滚动条滑到底
		        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
			},
            receiveFirstSingleMsg: function(msg, fromUserId) {
                // 1. 设置消息框可见
                $('.conRight').css("display", "-webkit-box");
                console.log(msg)
                // 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
                $('.newsList-temp').append(msg);
                var $focusUserId = $(".conLeft .bg").find('span.hidden-userId');
                console.log($focusUserId.length)
                // if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                $('.newsList').append(msg);
                // }

                // 3. 利用暂存区手动计算、调整新消息的宽度；
                var $answersDiv = $('.newsList-temp li').last().children("div").first();
                var fixWidth = 300; // 消息框本身的最长宽度
                var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
                var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
                var marginRightWidth; // 要计算消息框的margin-right宽度
                if ($answersDiv.actual('width') < fixWidth) {
                    console.log(4)
                    marginRightWidth = maxWidth - $answersDiv.actual('width');
                    $answersDiv.css("margin-right", marginRightWidth + "px");
                    // if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                    $('.newsList li').last().children("div").first()
                        .css("margin-right", marginRightWidth + "px");
                    // }
                    console.log($('.newsList li').prop("outerHTML"))
                } else {
                    console.log(5)
                    $answersDiv.css("width", fixWidth + "px")
                        .css("margin-right", minMarginRightWidth + "px");
                    if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                        $('.newsList li').last().children("div").first()
                            .css("width", fixWidth + "px")
                            .css("margin-right", minMarginRightWidth + "px");
                    }
                }
                console.log(sentMessageMap.get(fromUserId))
                console.log(fromUserId)
                console.log(sentMessageMap)

                // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区

                sentMessageMap.get(fromUserId).push($('.newsList li').eq($('.newsList li').length - 2).prop("outerHTML")+$('.newsList li').last().prop("outerHTML"));
                $('.newsList-temp').empty();

                // 5. 滚动条滑到底
                $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
            },
            receiveOfflineSingleMsg: function(msg, fromUserId) {
                // 1. 设置消息框可见
                $('.conRight').css("display", "-webkit-box");

                // 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
                $('.newsList-temp').append(msg);
                var $focusUserId = $(".conLeft .bg").find('span.hidden-userId');
                if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                    $('.newsList').append(msg);
                }

                // 3. 利用暂存区手动计算、调整新消息的宽度；
                var $answersDiv = $('.newsList-temp li').last().children("div").first();
                var fixWidth = 300; // 消息框本身的最长宽度
                var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
                var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
                var marginRightWidth; // 要计算消息框的margin-right宽度
                if ($answersDiv.actual('width') < fixWidth) {
                    marginRightWidth = maxWidth - $answersDiv.actual('width');
                    $answersDiv.css("margin-right", marginRightWidth + "px");
                    if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                        $('.newsList li').last().children("div").first()
                            .css("margin-right", marginRightWidth + "px");
                    }
                } else {
                    $answersDiv.css("width", fixWidth + "px")
                        .css("margin-right", minMarginRightWidth + "px");
                    if ($focusUserId.length > 0 && $focusUserId.html()  == fromUserId) {
                        $('.newsList li').last().children("div").first()
                            .css("width", fixWidth + "px")
                            .css("margin-right", minMarginRightWidth + "px");
                    }
                }
                console.log(sentMessageMap.get(fromUserId))
                console.log(fromUserId)
                console.log(sentMessageMap)

                // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区
                sentMessageMap.get(fromUserId).push($('.newsList-temp li').last().prop("outerHTML"));
                $('.newsList-temp').empty();

                // 5. 滚动条滑到底
                $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
            },
			receiveGroupMsg: function(msg, toGroupId) {
				// 1. 设置消息框可见
				$('.conRight').css("display", "-webkit-box"); 
				
				// 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
				$('.newsList-temp').append(msg);
	            var $focusGroupId = $(".conLeft .bg").find('span.hidden-groupId');
	            if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
	                $('.newsList').append(msg);  
	            }
	            
	            // 3. 手动计算、调整回显消息的宽度
	            var $answersDiv = $('.newsList-temp li').last().children("div").first();
	            var fixWidth = 300; // 消息框本身的最长宽度
	            var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
	            var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
	            var marginRightWidth; // 要计算消息框的margin-right宽度
	            if ($answersDiv.actual('width') < fixWidth) {
	                marginRightWidth = maxWidth - $answersDiv.actual('width');
	                $answersDiv.css("margin-right", marginRightWidth + "px");
	                if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
	                    $('.newsList li').last().children("div").first()
	                        .css("margin-right", marginRightWidth + "px");
	                }
	            } else {
	                $answersDiv.css("width", fixWidth + "px")
	                           .css("margin-right", minMarginRightWidth + "px");
	                if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
	                    $('.newsList li').last().children("div").first()
	                        .css("width", fixWidth + "px")
	                        .css("margin-right", minMarginRightWidth + "px");
	                }
	            }
	            
	            // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区
	            sentMessageMap.get(toGroupId).push($('.newsList-temp li').last().prop("outerHTML"));
	            $('.newsList-temp').empty();
	            
	            // 5. 滚动条滑到底
	            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
			}
	}
	
	var processFriendList = {
	    sending: function(content, $sendLi) {
	    	// 1. 设置部分新消息提醒
			if (content.length > 8) {
				content = content.substring(0, 8) + "...";
			}
			$('.conLeft').find('li.bg').children('.liRight').children('.infor').text(content);
			// 2. 如果存在新消息提醒徽章，则去除徽章
			if ($sendLi.find('.layui-badge').length > 0) {
				$sendLi.find('.layui-badge').remove();
			}
			//$('.conLeft ul').prepend('<li class="bg">' + $sendLi.html() + '</li>');
			// 3. 好友框新消息置顶
			$('.conLeft ul').prepend($sendLi.prop("outerHTML"));
			$sendLi.remove();
			$('.conLeft ul li').first().on('click', friendLiClickEvent)
	    },
	    
		receiving: function(content, $receiveLi) {
			// 1. 设置红色提醒徽章
			var $badge = $receiveLi.find(".layui-badge");
	        if ($badge.length > 0) {
	            $badge.html(parseInt($badge.html()) + 1);
	        } else {
	           var badgeHTML = '<span class="layui-badge badge-avatar">1</span>';
	           $receiveLi.children(".liLeft").prepend(badgeHTML);
	        }
	        // 2. 设置部分新消息提醒
	        if (content.length > 8) { // 只显示前八个字符
	           content = content.substring(0, 8) + "...";
	        }
	        if (content.search("<img") != -1) { // 若是图片，显示 “[图片]”
	        	content = "[图片]";
	        }
	        $receiveLi.children(".liRight").children('.infor').text(content);
	        
	        // 3. 新消息置顶
	        $('.conLeft ul').prepend($receiveLi.prop("outerHTML"));
	        $('.conLeft ul li').first().on('click',friendLiClickEvent);
	        $receiveLi.remove();
		}
	}
    function judgeDate(oldDate) {   // 判断是否是今天还是昨天，在项目中用于说说时的时间显示

        var day = new Date(oldDate);
        var dayStr = day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
        var timeStr = day.getHours()+":"+(day.getMinutes()< 10 ? "0"+day.getMinutes():day.getMinutes());

        //昨天的时间
        var day1 = new Date(new Date() - 1000 * 60 * 60 * 24);
        var yesterday = day1.getFullYear()+"-"+(day1.getMonth()+1)+"-"+day1.getDate();
        //今天的时间
        var day2 = new Date();
        var today = day2.getFullYear()+"-"+(day2.getMonth()+1)+"-"+day2.getDate();

        if(dayStr == today){
            return "今天 "+timeStr;
        }else if(dayStr == yesterday){
            return "昨天 "+timeStr;
        }else{
            return oldDate;
        }

    }
	// 自定义数据结构：已发送用户消息表
	function SentMessageMap() {
	    this.elements = new Array();

	    //获取MAP元素个数 
	    this.size = function () {
	        return this.elements.length;
	    };

	    //判断MAP是否为空 
	    this.isEmpty = function () {
	        return (this.elements.length < 1);
	    };

	    //删除MAP所有元素 
	    this.clear = function () {
	        this.elements = new Array();
	    };

	    //向MAP中增加元素（key, value) 
	    this.put = function (_key, _value) {
	        this.elements.push({
	            key: _key,
	            value: _value
	        });
	    };

	    //删除指定KEY的元素，成功返回True，失败返回False 
	    this.removeByKey = function (_key) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //删除指定VALUE的元素，成功返回True，失败返回False 
	    this.removeByValue = function (_value) {//removeByValueAndKey 
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //删除指定VALUE的元素，成功返回True，失败返回False 
	    this.removeByValueAndKey = function (_key, _value) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value && this.elements[i].key == _key) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //获取指定KEY的元素值VALUE，失败返回NULL 
	    this.get = function (_key) {
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    return this.elements[i].value;
	                }
	            }
	        } catch (e) {
	            return false;
	        }
	        return false;
	    };

	    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL 
	    this.element = function (_index) {
	        if (_index < 0 || _index >= this.elements.length) {
	            return null;
	        }
	        return this.elements[_index];
	    };

	    //判断MAP中是否含有指定KEY的元素 
	    this.containsKey = function (_key) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //判断MAP中是否含有指定VALUE的元素 
	    this.containsValue = function (_value) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //判断MAP中是否含有指定VALUE的元素 
	    this.containsObj = function (_key, _value) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value && this.elements[i].key == _key) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    };

	    //获取MAP中所有VALUE的数组（ARRAY） 
	    this.values = function () {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].value);
	        }
	        return arr;
	    };

	    //获取MAP中所有VALUE的数组（ARRAY） 
	    this.valuesByKey = function (_key) {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            if (this.elements[i].key == _key) {
	                arr.push(this.elements[i].value);
	            }
	        }
	        return arr;
	    };

	    //获取MAP中所有KEY的数组（ARRAY） 
	    this.keys = function () {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].key);
	        }
	        return arr;
	    };

	    //获取key通过value 
	    this.keysByValue = function (_value) {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            if (_value == this.elements[i].value) {
	                arr.push(this.elements[i].key);
	            }
	        }
	        return arr;
	    };

	    //获取MAP中所有KEY的数组（ARRAY） 
	    this.keysRemoveDuplicate = function () {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            var flag = true;
	            for (var j = 0; j < arr.length; j++) {
	                if (arr[j] == this.elements[i].key) {
	                    flag = false;
	                    break;
	                }
	            }
	            if (flag) {
	                arr.push(this.elements[i].key);
	            }
	        }
	        return arr;
	    };
	}