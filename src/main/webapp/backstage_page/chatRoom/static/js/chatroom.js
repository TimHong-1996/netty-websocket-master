    // console.log(socket)
    var MessageMap = null;
    var sentMessageMap;
function setUserInfo() {
        $.ajax({
            type : 'POST',
            url : '/chat/getInfo',
            dataType: 'json',
            async : true,
                success: function(data) {
                    console.log("获取用户信息...");
                    console.log(data)
                    if (data.code == 2000) {
                        var userInfo = data.managerDto;
                        userId = userInfo.managerId;
                        $("#username").html(userInfo.managerName);
                        $("#avatarUrl").attr("src", "./static/img/avatar/Member001.jpg");
                        // var groupListHTML = "";
                        // var groupList = userInfo.groupList;
                        // for (var i = 0; i < groupList.length; i++) {
                        //     groupListHTML +=
                        //     '<li>' +
                        //         '<div class="liLeft"><img src="' + groupList[i].groupAvatarUrl + '"></div>' +
                        //             '<div class="liRight">' +
                        //                 '<span class="hidden-groupId">' + groupList[i].groupId + '</span>' +
                        //                 '<span class="intername">' + groupList[i].groupName + '</span>' +
                        //                 '<span class="infor"></span>' +
                        //             '</div>' +
                        //     '</li>';
                        // }
                        // $('.conLeft ul').append(groupListHTML);

                        var friendListHTML = "";
                        var friendList = new SentMessageMap();
                        // MessageMap = data.data;
                        sentMessageMap = new SentMessageMap();

                        for(var key in data.data){
                            // friendList.put(data.data[key].managerId,new Array());
                            sentMessageMap.put(data.data[key].managerId,  new SentMessageMap());
                            // console.log(key)
                            // console.log(data.data[key])
                            // friendListHTML = "";
                            // for (var i = 0; i < friendList.length; i++) {
                            //     console.log(friendList[i])
                                // if(userId != friendList[i].managerId){
                                //     friendListHTML +=
                                //         '<div><div style="display: flex;" onclick="showUserList(this)" data-id="'+data.data[key].managerId+'">\n' +
                                //         '                    <div><img src="static/img/avatar/Member003.jpg"></div>\n' +
                                //         '                    <div style="width: 100%;padding-left: .5rem;">\n' +
                                //         '                        <div>'+data.data[key].managerName+'</div>\n' +
                                //         '                        <div>共'+Object.getOwnPropertyNames(data.data[key].visitorDtoMap).length+'位用户</div>\n' +
                                //         '                    </div>\n' +
                                //         '                </div>\n' +
                                //         '                <div style="display: none;" class="userList"><ul>';
                                // }

                            // }


                            for(var nextKey in data.data[key].visitorDtoMap){
                                // friendList.unshift(data.data[key][nextKey]);


                                // friendList.get(data.data[key].managerId).unshift(data.data[key].visitorDtoMap[nextKey])
                                sentMessageMap.get(data.data[key].managerId).put(nextKey,new Array());
                                // friendListHTML += '<li>\n' +
                                //     '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                                //     '                            <div class="liRight">\n' +
                                //     '                            <span class="hidden-userId">'+data.data[key].visitorDtoMap[nextKey].visitorId+'</span>\n' +
                                //     '                            <span class="intername">'+data.data[key].visitorDtoMap[nextKey].visitorName+'</span>\n' +
                                //     '                            <span class="infor"></span>\n' +
                                //     '                            </div>\n' +
                                //     '                        </li>'
                            }
                            // friendListHTML +='</ul>\n' +
                            //     '                </div>\n' +
                            //     '            </div>';

                        }
                        // console.log(friendList)
                        // console.log(sentMessageMap)
                        // 设置好友列表
                        // $('.conLeft ').append(friendListHTML);
                        // 绑定好友框点击事件
                        $('.conLeft ul li').on('click', friendLiClickEvent);

                    } else {
                        alert(data.message);
                        window.location.href="login.html";
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
            console.log("123")
            if (socket.readyState == WebSocket.OPEN) {
                console.log("3")
                var data = {
                    "userId" : userId,
                    "type" : "REGISTER_MANAGER"
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
                    "type" : "SINGLE_SENDING"
                };
                socket.send(JSON.stringify(data));
            } else {
                alert("Websocket连接没有开启！");
            }
        },
        singleFirstSend: function(fromUserId, toUserId) {
            if (!window.WebSocket) {
                return;
            }
            console.log(socket)
            console.log(WebSocket.OPEN)
            if (socket.readyState == WebSocket.OPEN) {
                var data = {
                    "fromUserId" : fromUserId,
                    "toUserId" : toUserId,
                    "type" : "SINGLE_FIRST_SENDING"
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
            console.log(json)
            // $('.conLeft ul').html("");
            var friendListHTML = "";
            var friendList = new SentMessageMap();
            // MessageMap = data.data;
            sentMessageMap = new SentMessageMap();
            $('.conLeft ').html("");
            for(var key in json.data){
                friendList.put(json.data[key].managerId,new Array());
                sentMessageMap.put(json.data[key].managerId,  new SentMessageMap());
                console.log(key)
                console.log(json.data[key])
                // friendListHTML = "";
                // for (var i = 0; i < friendList.length; i++) {
                //     console.log(friendList[i])
                // if(userId != friendList[i].managerId){
                friendListHTML +=
                    '<div><div style="display: flex;" onclick="showUserList(this)" data-id="'+json.data[key].managerId+'">\n' +
                    '                    <div style="padding: .5rem;position: relative;"><img src="static/img/avatar/Member003.jpg"></div>\n' +
                    '                    <div style="width: 100%;padding-left: .5rem;">\n' +
                    '                        <div>'+json.data[key].managerName+'</div>\n' +
                    '                        <div>共<span class="totalNum">'+Object.getOwnPropertyNames(json.data[key].visitorDtoMap).length+'</span>位用户</div>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '                <div style="display: none;" class="userList"><ul>';
                // }

                // }


                for(var nextKey in json.data[key].visitorDtoMap){
                    // friendList.unshift(data.data[key][nextKey]);


                    friendList.get(json.data[key].managerId).unshift(json.data[key].visitorDtoMap[nextKey])
                    sentMessageMap.get(json.data[key].managerId).put(nextKey,new Array());
                    friendListHTML += '<li>\n' +
                        '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                        '                            <div class="liRight">\n' +
                        '                            <span class="hidden-userId">'+json.data[key].visitorDtoMap[nextKey].visitorId+'</span>\n' +
                        '                            <span class="intername">'+json.data[key].visitorDtoMap[nextKey].visitorName+'</span>\n' +
                        '                            <span class="infor"></span>\n' +
                        '                            </div>\n' +
                        '                        </li>'
                }
                friendListHTML +='</ul>\n' +
                    '                </div>\n' +
                    '            </div>';

            }
            // 设置好友列表
            $('.conLeft ').append(friendListHTML);
            // 绑定好友框点击事件
            $('.conLeft ul li').on('click', friendLiClickEvent);
        },
        registerAdviserReceive: function(json) {
            // console.log("userId为 " + userId + " 的用户登记到在线用户表成功！");
            console.log(JSON.parse(json.data))
            json.managerDto = JSON.parse(json.data);
            var is_have = false;
            for(var i = 0 ; i < $(".conLeft div").length;i++){
                if($(".conLeft div").eq(i).attr("data-id") == json.managerDto.managerId){
                    is_have = true;
                }
            }
            console.log(json)
            // $('.conLeft ul').html("");
            if(!is_have){
                var friendListHTML = "";
                var friendList = new SentMessageMap();
                // MessageMap = data.data;
                sentMessageMap = new SentMessageMap();
                // $('.conLeft ').html("");
                // for(var key in json.data){

                    friendList.put(json.managerDto.managerId,new Array());
                    sentMessageMap.put(json.managerDto.managerId,  new SentMessageMap());
                //     console.log(key)
                //     console.log(json.data[key])
                //     friendListHTML = "";
                    // for (var i = 0; i < friendList.length; i++) {
                    //     console.log(friendList[i])
                    // if(userId != friendList[i].managerId){
                    friendListHTML +=
                        '<div><div style="display: flex;" onclick="showUserList(this)" data-id="'+json.managerDto.managerId+'">\n' +
                        '                    <div style="padding: .5rem;position: relative;"><img src="static/img/avatar/Member003.jpg"></div>\n' +
                        '                    <div style="width: 100%;padding-left: .5rem;">\n' +
                        '                        <div>'+json.managerDto.managerName+'</div>\n' +
                        '                        <div>共<span class="totalNum">'+(typeof (json.visitorInfoMap) == "undefined" ? "0":Object.getOwnPropertyNames(json.visitorInfoMap).length)+'</span>位用户</div>\n' +
                        '                    </div>\n' +
                        '                </div>\n' +
                        '                <div style="display: none;" class="userList"><ul>';
                    // }

                    // }

                    // console.log(typeof (json.visitorInfoMap))
                    for(var nextKey in json.visitorInfoMap){
                        // friendList.unshift(json.visitorInfoMap[nextKey]);
                        friendList.get(json.managerDto.managerId).unshift(json.visitorInfoMap[nextKey])
                        sentMessageMap.get(json.managerDto.managerId).put(nextKey,new Array());
                        friendListHTML += '<li>\n' +
                            '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                            '                            <div class="liRight">\n' +
                            '                            <span class="hidden-userId">'+json.visitorInfoMap[nextKey].visitorId+'</span>\n' +
                            '                            <span class="intername">'+json.visitorInfoMap[nextKey].visitorName+'</span>\n' +
                            '                            <span class="infor"></span>\n' +
                            '                            </div>\n' +
                            '                        </li>'
                    }
                    friendListHTML +='</ul>\n' +
                        '                </div>\n' +
                        '            </div>';

                // }
                // 设置好友列表
                $('.conLeft ').append(friendListHTML);
                // 绑定好友框点击事件
                $('.conLeft ul li').on('click', friendLiClickEvent);
            }
        },
        registerUserReceive: function(json) {
            // console.log("userId为 " + userId + " 的用户登记到在线用户表成功！");
            json.visitorDto = JSON.parse(json.data);
            var is_have = false;
            for(var i = 0 ; i < $(".conLeft div").length;i++){
                if($(".conLeft div").eq(i).attr("data-id") == "0"){
                    var obj = $(".conLeft div").eq(i);
                    console.log(obj.find(".totalNum").html())
                    for(var j = 0 ; j < obj.next().find("li").length;j++){
                        if(obj.next().find("li").eq(j).find(".hidden-userId").html()==json.visitorDto.visitorId){
                            is_have = true;

                        }
                    }
                }
            }
            if(!is_have){
                obj.find(".totalNum").text(parseInt(obj.find(".totalNum").html())+1)
                console.log(json)
                // $('.conLeft ul').html("");
                var friendListHTML = "";
                // var friendList = new SentMessageMap();
                // MessageMap = data.data;
                // sentMessageMap = new SentMessageMap();
                // $('.conLeft ').html("");
                // for(var key in json.data){
                //     friendList.put(json.data[key].managerId,new Array());
                //     sentMessageMap.put(json.data[key].managerId,  new SentMessageMap());
                    // console.log(key)
                    // console.log(json.data[key])
                    // friendListHTML = "";
                    // for (var i = 0; i < friendList.length; i++) {
                    //     console.log(friendList[i])
                    // if(userId != friendList[i].managerId){
                    // friendListHTML +=
                    //     '<div><div style="display: flex;" onclick="showUserList(this)" data-id="'+json.data[key].managerId+'">\n' +
                    //     '                    <div><img src="static/img/avatar/Member003.jpg"></div>\n' +
                    //     '                    <div style="width: 100%;padding-left: .5rem;">\n' +
                    //     '                        <div>'+json.data[key].managerName+'</div>\n' +
                    //     '                        <div>共'+Object.getOwnPropertyNames(json.data[key].visitorDtoMap).length+'位用户</div>\n' +
                    //     '                    </div>\n' +
                    //     '                </div>\n' +
                    //     '                <div style="display: none;" class="userList"><ul>';
                    // }

                    // }


                    // for(var nextKey in json.data[key].visitorDtoMap){
                        // friendList.unshift(data.data[key][nextKey]);


                        // friendList.get(json.data[key].managerId).unshift(json.data[key].visitorDtoMap[nextKey])
                        // sentMessageMap.get(json.data[key].managerId).put(nextKey,new Array());
                        friendListHTML += '<li>\n' +
                            '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                            '                            <div class="liRight">\n' +
                            '                            <span class="hidden-userId">'+json.visitorDto.visitorId+'</span>\n' +
                            '                            <span class="intername">'+json.visitorDto.visitorName+'</span>\n' +
                            '                            <span class="infor"></span>\n' +
                            '                            </div>\n' +
                            '                        </li>'
                    // }
                    // friendListHTML +='</ul>\n' +
                    //     '                </div>\n' +
                    //     '            </div>';

                // }
                // 设置好友列表
                obj.next().children("ul").append(friendListHTML);
                // 绑定好友框点击事件
                $('.conLeft ul li').on('click', friendLiClickEvent);
            }
        },
        offlineReceive:function(data){
            console.log(data);
            var fromUserId = data.data.toId;
            var content = data.data.content;
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
            answer += '<li class="time-li"><span style="text-align: center;background: rgba(0,0,0,.5);color: #fff; padding: .5rem; width: 50%;margin: 0 auto; border-radius: 5px;">[系统消息] 该用户已下线</span></li>';

            // 消息框处理
            processMsgBox.receiveOfflineSingleMsg(answer, fromUserId);
            // 好友列表处理
            processFriendList.receiving(content, $receiveLi);

        },
        singleReceive: function(data,visitorDto) {
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

            if($(".qqBox").is(':hidden')){
                // var bottom =  ($("#toastList .tip-toast").length + 1) * 2 ;
                var html = '<div class="tip-toast" style="bottom:2rem;">\n' +
                    '        <div style="display: inline-block;">\n' +
                    '            <img style="border-radius: 2rem;" src="static/img/avatar/Member001.jpg">\n' +
                    '        </div>\n' +
                    '        <div style="display: inline-block;vertical-align: middle;color: #fff;">\n' +
                    '            <div>'+visitorDto.visitorName +'<span style="font-size:.8rem">'+data.date.substring(10,19)+'</span></div>\n' +
                    '            <div>'+content+' <a onclick="showBox()">点击查看</a></div>\n' +
                    '        </div>\n' +
                    '    </div>'
                $("#toastList").append(html);
            }
        },
        singleAdviserReceive: function(data,visitorDto) {
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
            answer +='<li style="text-align: right;">' +
                '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.date +'</div>'+
                '<div class="news" style="display: inline-block;width: auto;float:none;">'+ content +'</div></div >' +
                '<div class="nesHead" style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member001.jpg"/></div>' +
                '</li>';
            // console.log(sentMessageMap.get(data.formId).get(data.toId))
            sentMessageMap.get(data.formId).get(data.toId).push(answer);

            for(var i = 0 ; i < $("div.conLeft > div").length;i++){
                if($("div.conLeft > div").eq(i).children("div").eq(0).attr("data-id") == data.formId){
                    var obj = $("div.conLeft > div").eq(i);
                    var $badge = $("div.conLeft > div").eq(i).children("div").eq(0).find(".layui-badge");
                    if ($badge.length > 0) {
                        $badge.html(parseInt($badge.html()) + 1);
                    } else {
                        var badgeHTML = '<span class="layui-badge badge-avatar" style="margin-left: 30px;margin-top: -5px;">1</span>';
                        // $receiveLi.children(".liLeft").prepend(badgeHTML);
                        $("div.conLeft > div").eq(i).children("div").eq(0).prepend(badgeHTML);
                    }
                    console.log(obj.find("li").length)
                    for(var j = 0 ; j < obj.find("li").length;j++){
                        if(obj.find("li").eq(j).hasClass("bg") && obj.find("li.bg .hidden-userId").html()==data.toId){
                            console.log(123)
                            $('.newsList').append(answer);
                            // $receiveLi = obj.next().find("li.bg ");
                        }
                        if(obj.find("li").eq(j).find(".hidden-userId").html()==data.toId){

                            $receiveLi = obj.find("li ").eq(j);
                        }
                    }
                }
            }
            console.log($receiveLi)
            processFriendList.receiving(content, $receiveLi,obj);
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
        },
        singleProductReceive: function(data,historyMap) {
            // 获取、构造参数
            console.log(data);
            var content = data.content;
            var fromUserId = data.formId;
            var managerDto = data.objData.ManagerDto;
            var visitorDto = data.objData.VisitorDto;

            //添加客服

            //添加访客
            //1、将访客增加到对应的客服列表中
            var is_have_li = false;
            for(var i = 0 ; i < $(".conLeft div").length;i++){
                if($(".conLeft div").eq(i).attr("data-id") == managerDto.managerId){
                    var obj = $(".conLeft div").eq(i);
                    for(var j = 0 ; j < obj.next().find("li").length;j++){
                        if(obj.next().find("li").eq(j).find(".hidden-userId").html()==visitorDto.visitorId){
                            is_have_li = true ;
                        }
                    }
                }
            }
            if(!is_have_li){
                sentMessageMap.put(managerDto.managerId,  new SentMessageMap());
                sentMessageMap.get( managerDto.managerId).put(visitorDto.visitorId,new Array());
                obj.find(".totalNum").text(parseInt(obj.find(".totalNum").html())+1)
                var friendListHTML = '<li class="bg">\n' +
                    '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                    '                            <div class="liRight">\n' +
                    '                            <span class="hidden-userId">'+visitorDto.visitorId+'</span>\n' +
                    '                            <span class="intername">'+visitorDto.visitorName+'</span>\n' +
                    '                            <span class="infor"></span>\n' +
                    '                            </div>\n' +
                    '                        </li>';
                // 设置好友列表
                obj.next().children("ul").append(friendListHTML);
                // 绑定好友框点击事件
                $('.conLeft ul li').on('click', friendLiClickEvent);

                showHistoryList(historyMap,managerDto.managerId,visitorDto.visitorId)
            }

            //添加内容
            $(".conRight").show();
            var answer='';
            answer += '<li style="text-align: left;">' +
                '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: top;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
                '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.date +'</div>'+
                '<div class="answers" style="display: inline-block;width: auto;float:none;"><a style="display: inline-flex;"><div><img src="'+data.objData.productImg+'" style="width: 124px;height: 84px;margin: 10px;"></div><div style="width: 200px;padding-top: 5px;"><p style="font-size: 18px;font-weight: bolder;">'+data.objData.productName+'</p><p style="margin: 10px 0;">'+data.objData.productPrice+'</p><p>'+data.objData.productPrice+'</p></div></a></div></div >' +
                '</li>';

            // 消息框处理
            // processMsgBox.receiveSingleMsg(answer, fromUserId);
            $('.newsList').html('');
            var messageArray;
            // if(!sentMessageMap.get(fromUserId)){
            //     sentMessageMap.put(fromUserId,new Array());
            //
            // }
            messageArray = sentMessageMap.get( managerDto.managerId).get(visitorDto.visitorId);
            messageArray.push(answer);
            for (var i = 0; i < messageArray.length; i++) {

                $('.newsList').append(messageArray[i]);
            }
            console.log(messageArray)
            // 5.设置消息框滚动条滑到底部
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
            // 好友列表处理
            // processFriendList.receiving(content, obj);
            // var fromUserId = data.toId;
            // var content = data.content;
            // var fromAvatarUrl;
            // var $receiveLi;
            // $('.conLeft').find('span.hidden-userId').each(function(){
            //     if (this.innerHTML == fromUserId) {
            //         fromAvatarUrl = $(this).parent(".liRight")
            //             .siblings(".liLeft").children('img').attr("src");
            //         $receiveLi = $(this).parent(".liRight").parent("li");
            //     }
            // })
            // var answer='';
            // answer +='<li style="text-align: left;">' +
            //     '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
            //     '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.date +'</div>'+
            //     '<div class="answers" style="display: inline-block;width: auto;float:none;">'+ content +'</div></div >' +
            //     '</li>';
            // // console.log(sentMessageMap.get(data.formId).get(data.toId))
            // sentMessageMap.get(data.toId).get(data.formId).push(answer);
            // for(var i = 0 ; i < $(".conLeft div").length;i++){
            //     if($(".conLeft div").eq(i).attr("data-id") == data.toId){
            //         var obj = $(".conLeft div").eq(i);
            //         var $badge = $(".conLeft div").eq(i).children("div").eq(0).find(".layui-badge");
            //         if ($badge.length > 0) {
            //             $badge.html(parseInt($badge.html()) + 1);
            //         } else {
            //             var badgeHTML = '<span class="layui-badge badge-avatar" style="margin-left: 30px;margin-top: -5px;">1</span>';
            //             // $receiveLi.children(".liLeft").prepend(badgeHTML);
            //             $(".conLeft div").eq(i).children("div").eq(0).prepend(badgeHTML);
            //         }
            //         for(var j = 0 ; j < obj.next().find("li").length;j++){
            //             if(obj.next().find("li.bg .hidden-userId").html()==data.formId){
            //                 $('.newsList').append(answer);
            //                 // $receiveLi = obj.next().find("li.bg ");
            //             }
            //             if(obj.next().find("li").eq(j).find(".hidden-userId").html()==data.formId){
            //                 $receiveLi = obj.next().find("li ").eq(j);
            //             }
            //         }
            //     }
            // }
            // console.log($receiveLi)
            // processFriendList.receiving(content, $receiveLi,obj);
            // $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
        },
        singleUserReceive: function(data,visitorDto) {
            // 获取、构造参数
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
            var answer='';
            answer +='<li style="text-align: left;">' +
                '<div class="answerHead"  style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member002.jpg"/></div>' +
                '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.date +'</div>'+
                '<div class="answers" style="display: inline-block;width: auto;float:none;">'+ content +'</div></div >' +
                '</li>';
            // console.log(sentMessageMap.get(data.formId).get(data.toId))
            sentMessageMap.get(data.toId).get(data.formId).push(answer);

            for(var i = 0 ; i < $("div.conLeft > div").length;i++){
                if($("div.conLeft > div").eq(i).children("div").eq(0).attr("data-id") == data.toId){
                    var obj = $("div.conLeft > div").eq(i);
                    var $badge = $("div.conLeft > div").eq(i).children("div").eq(0).find(".layui-badge");
                    if ($badge.length > 0) {
                        $badge.html(parseInt($badge.html()) + 1);
                    } else {
                        var badgeHTML = '<span class="layui-badge badge-avatar" style="margin-left: 30px;margin-top: -5px;">1</span>';
                        // $receiveLi.children(".liLeft").prepend(badgeHTML);
                        $("div.conLeft > div").eq(i).children("div").eq(0).prepend(badgeHTML);
                    }
                    console.log(obj.find("li").length)
                    for(var j = 0 ; j < obj.find("li").length;j++){
                        if(obj.find("li").eq(j).hasClass("bg") && obj.find("li.bg .hidden-userId").html()==data.formId){
                            console.log(123)
                            $('.newsList').append(answer);
                            // $receiveLi = obj.next().find("li.bg ");
                        }
                        if(obj.find("li").eq(j).find(".hidden-userId").html()==data.formId){

                            $receiveLi = obj.find("li ").eq(j);
                        }
                    }
                }
            }
            console.log($receiveLi)
            processFriendList.receiving(content, $receiveLi,obj);
            $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
        },
        showHistory: function(data,historyMap,visitorDto,managerDto) {
            // 获取、构造参数
            console.log("data",data)
            console.log("historyMap",historyMap)
            console.log("visitorDto",visitorDto)
            console.log("managerDto",managerDto)

            console.log(data);
            //1、将访客增加到对应的客服列表中
            var is_have_li = false;
            for(var i = 0 ; i < $(".conLeft div").length;i++){
                if($(".conLeft div").eq(i).attr("data-id") == managerDto.managerId){
                    var obj = $(".conLeft div").eq(i);
                    for(var j = 0 ; j < obj.next().find("li").length;j++){
                        if(obj.next().find("li").eq(j).find(".hidden-userId").html()==visitorDto.visitorId){
                            is_have_li = true ;
                        }
                    }
                }
            }
            if(!is_have_li){
                sentMessageMap.put(managerDto.managerId,  new SentMessageMap());
                sentMessageMap.get( managerDto.managerId).put(visitorDto.visitorId,new Array());
                obj.find(".totalNum").text(parseInt(obj.find(".totalNum").html())+1)
                var friendListHTML = '<li>\n' +
                    '                            <div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>\n' +
                    '                            <div class="liRight">\n' +
                    '                            <span class="hidden-userId">'+visitorDto.visitorId+'</span>\n' +
                    '                            <span class="intername">'+visitorDto.visitorName+'</span>\n' +
                    '                            <span class="infor"></span>\n' +
                    '                            </div>\n' +
                    '                        </li>';
                // 设置好友列表
                obj.next().children("ul").append(friendListHTML);
                // 绑定好友框点击事件
                $('.conLeft ul li').on('click', friendLiClickEvent);


            }
            //2、将历史记录加载到对应的缓存区

            showHistoryList(historyMap,managerDto.managerId,visitorDto.visitorId)
            console.log(sentMessageMap.get(managerDto.managerId).get(visitorDto.visitorId))
            // $(".conLeft ul li").removeClass("bg");
            // var is_have = false;
            // //历史记录、当前用户ID
            // for(var i = 0 ; i < $(".conLeft ul li").length ; i++){
            //     console.log($(".conLeft ul li").eq(i).find(".liRight .hidden-userId").text())
            //     console.log(visitorDto.visitorId)
            //
            //     if($(".conLeft ul li").eq(i).find(".liRight .hidden-userId").text() == visitorDto.visitorId){
            //         $(".conLeft ul li").eq(i).addClass("bg");
            //         $('#toUserId').val(visitorDto.visitorId);
            //         is_have = true;
            //     }
            // }
            // if(!is_have){
            //     sentMessageMap.put(visitorDto.visitorId, new Array());
            //     var friendListHTML =
            //         '<li class="bg">' +
            //         '<div class="liLeft"><img src="./static/img/avatar/Member002.jpg"></div>' +
            //         '<div class="liRight">' +
            //         '<span class="hidden-userId">' + visitorDto.visitorId + '</span>' +
            //         '<span class="intername">' + visitorDto.visitorName + '</span>' +
            //         '<span class="infor"></span>' +
            //         '</div>' +
            //         '</li>';
            //     // 设置好友列表
            //     $('.conLeft ul').append(friendListHTML);
            //     // 绑定好友框点击事件
            //     $('.conLeft ul li').on('click', friendLiClickEvent);
            //     $('#toUserId').val(visitorDto.visitorId);
            // }
            //
            // $(".Righthead .headName").html(visitorDto.visitorName);
            // showHistoryList(historyMap,userId,data.toId);
            //
            // if($(".qqBox").is(':hidden')){
            //     // var bottom =  ($("#toastList .tip-toast").length + 1) * 2 ;
            //     var html = '<div class="tip-toast" style="bottom:2rem;">\n' +
            //         '        <div style="display: inline-block;">\n' +
            //         '            <img style="border-radius: 2rem;" src="static/img/avatar/Member001.jpg">\n' +
            //         '        </div>\n' +
            //         '        <div style="display: inline-block;vertical-align: middle;color: #fff;">\n' +
            //         '            <div>'+visitorDto.visitorName +'<span style="font-size:.8rem">'+data.date.substring(10,19)+'</span></div>\n' +
            //         '            <div>正在向您咨询，请尽快回复 <a onclick="showBox()">点击查看</a></div>\n' +
            //         '        </div>\n' +
            //         '    </div>'
            //     $("#toastList").append(html);
            // }
            // if(  data.content != ""){
            //
            //     var fromUserId = data.formId;
            //     var content = data.content;
            //     var date = data.date;
            //     chatTime = data.date;
            //     var fromAvatarUrl;
            //     var $receiveLi;
            //     $('.conLeft').find('span.hidden-userId').each(function(){
            //         if (this.innerHTML == fromUserId) {
            //             fromAvatarUrl = $(this).parent(".liRight")
            //                 .siblings(".liLeft").children('img').attr("src");
            //             $receiveLi = $(this).parent(".liRight").parent("li");
            //         }
            //     })
            //     var dateStr = judgeDate(date);
            //     console.log(dateStr)
            //     var answer='';
            //     answer += '<li class="time-li"><span>'+dateStr+'</span></li><li>' +
            //         '<div class="answers">'+ content +'</div>' +
            //         '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
            //         '</li>';
            //
            //     // 消息框处理
            //     processMsgBox.receiveFirstSingleMsg(answer, fromUserId);
            //     // 好友列表处理
            //     processFriendList.receiving(content, $receiveLi);
            // }
        },
        singleFirstReceive: function(data) {
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
            var answer='';
            answer += '<li style="text-align: right;">' +
                '<div style="display: inline-block;"><div style="margin-left: 10px;font-size: 12px;color: #AAA;">'+ data.date +'</div>'+
                '<div class="news" style="display: inline-block;width: auto;float:none;">'+ content +'</div></div >' +
                '<div class="nesHead" style="display: inline-block;float:none;vertical-align: text-bottom;"><img src="./static/img/avatar/Member001.jpg"/></div>' +
                '</li>';
            console.log(sentMessageMap.get(data.formId).get(data.toId))
            sentMessageMap.get(data.formId).get(data.toId).push(answer);
            for(var i = 0 ; i < $(".conLeft div").length;i++){
                if($(".conLeft div").eq(i).attr("data-id") == data.formId){
                    var obj = $(".conLeft div").eq(i);
                    for(var j = 0 ; j < obj.next().find("li").length;j++){
                        console.log(j)
                        if(obj.next().find("li .hidden-userId").html()==data.toId){
                            $('.newsList').append(answer);
                            $receiveLi = obj.next().find("li").eq(j);
                            console.log($receiveLi)
                            processFriendList.receiving(content, $receiveLi,obj);
                        }

                    }
                }
            }
            // if($(".bg .liRight .hidden-userId").html() == toUserId){
            //     $('.newsList').append($('.newsList-temp li').last().prop("outerHTML"));
            // }
            // 消息框处理
            // processMsgBox.sendFirstReceive(answer, fromUserId);
            // 好友列表处理


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
    
    function logout() {
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
			    console.log("fromUserId",fromUserId)
                console.log("toUserId",toUserId)
                console.log("news",news)

                ws.singleSend(fromUserId, toUserId, news);
			} else {
				ws.groupSend(fromUserId, toGroupId, news);
			}

			$('#dope').val('');			
			var avatarUrl = $('#avatarUrl').attr("src");
			var msg = '';
			msg += '<li>'+
					'<div class="news">' + news + '</div>' +
					'<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
				'</li>';
			
			// 消息框处理：
			processMsgBox.sendMsg(msg, toUserId, toGroupId)
					
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
		// var toGroupId = $('#toGroupId').val();
		var content  = '<img class="Expr" src="' + imgSrc + '">';
		if (toUserId == '' && toGroupId == '') {
			alert("请选择对话方");
			return;
		}
		// if (toUserId.length != 0) {
		    ws.singleSend(fromUserId, toUserId, content);
		// } else {
		// 	ws.groupSend(fromUserId, toGroupId, content);
		// }
		var avatarUrl = $('#avatarUrl').attr("src");
		var msg = '';
		msg += '<li>'+
				'<div class="news">' + content + '</div>' +
				'<div class="nesHead"><img src="' + avatarUrl + '"/></div>' +
			'</li>';
		processMsgBox.sendMsg(msg, toUserId, toGroupId);
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
        // var toGroupId = $('#toGroupId').val();
        // var content  = '<img class="Expr" src="' + imgSrc + '">';
        if (toUserId == '' && toGroupId == '') {
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
        processMsgBox.sendMsg(msg, toUserId, toGroupId);
        var $sendLi = $('.conLeft').find('li.bg');
        var content = txt.substring(0, 8) + "...";
        processFriendList.sending(content, $sendLi);
    })
    function showHistoryList(list,userId,toId){
        console.log("showHistoryList",list)
        // $(".conRight").show();
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

        }else{
            html += '<div style="text-align: center;color: #bdbdbd;" >暂无历史信息</div> <hr>';
        }
        html += '<div style="text-align: center;background: rgba(0,0,0,.5);color: #fff; padding: .5rem; width: 50%;margin: 0 auto; border-radius: 5px;">[系统消息] 该用户正在向该客服进行咨询</div>';
        console.log(sentMessageMap);
        console.log(toId);

        sentMessageMap.get(userId).get(toId).push(html);
        // $(".RightCont ul").html(html);
        // $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
    }
    function sendOpen(toId){
        // alert("发送开场白")
        ws.singleFirstSend(userId,toId);
    }
    function showBox(){
        $(".qqBox").show();
        $(this).remove();
    }
    function getLogList(page){
        var managerId = $('ul li.bg').parent().parent().prev().attr("data-id");
        var visitorId = $('ul li.bg .liRight .hidden-userId').html();
        console.log("managerId",managerId);
        console.log("visitorId",visitorId);

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
                            if(data.data.list[i].logType == 1){
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
	// 好友框点击事件
	function friendLiClickEvent(){
		
		// 1. 设置点击阴影效果
        $(".bg").removeClass('bg');
	    // $(this).addClass('bg').siblings().removeClass('bg');
        $(this).addClass('bg');

	    // 2. 设置显示右侧消息框
	    $('.conRight').css("display", "-webkit-box");
		
	    // 3. 设置消息框显示对方信息，清空对方id
		var intername=$(this).children('.liRight').children('.intername').text();
		//客服ID
		var adviserId = $(this).parent().parent().prev().attr("data-id");
		//用户ID
        var userId = $(this).children('.liRight').children('.hidden-userId').text();
        console.log("adviserId",adviserId);
        console.log("userId",userId);

        // var toGroupId = $(this).children('.liRight').children('.hidden-groupId').text();
		/*alert('userId:' + (toUserId.length != 0));
		alert('groupId:' + toGroupId);*/
		$('.headName').text(intername);
		$('#toUserId').val("");
		// $('#toGroupId').val("");
		
		// 4. 设置显示已收到的信息，设置好对方的id
		$('.newsList').html('');
		var messageArray;
		console.log(sentMessageMap)
        messageArray = sentMessageMap.get(adviserId).get(userId);
        // $('#toUserId').val(toUserId);
        console.log(messageArray)
		for (var i = 0; i < messageArray.length; i++) {
			$('.newsList').append(messageArray[i]);
		}
		
		// 5.设置消息框滚动条滑到底部
		$('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
		
		// 6. 去掉红色提醒徽章
		var $badge = $(this).find(".layui-badge");
		if ($badge.length > 0) {
		    var num = parseInt($badge.html());
			$badge.remove();
			var par_badge = $(this).parent().parent().prev().find(".layui-badge");
			if(par_badge.length > 0){
			    var par_num = parseInt(par_badge.html());
			    var end_num = par_num - num;
			    if(end_num == 0 ){
                    par_badge.remove();
                }else{
                    par_badge.html(end_num);
                }
            }
		}

        closeHistory();
	}
	
	// 处理消息框的对象，统一管理相关处理函数，主要包括4个事件函数：
	// (实际上应该有8个事件函数，发送得4个：单发普通信息、群发普通信息、单发文件信息、群发文件信息，
	// 再加上对应的接收4个，但根据实际情况，发现代码可重用，于是便缩减为4个)
	// 1. sendMsg: 发送(单个、群)消息时，调用此函数处理消息框变化；
	// 2. sendFileMsg： 文件上传成功后，发送(单个、群)文件消息时，调用此函数处理消息框变化；
	// 3. receiveSingleMsg： 收到单发(普通对话、文件)消息时，调用此函数处理消息框变化；
	// 4. receiveGroupMsg： 收到群发(普通对话、文件)消息时，调用此函数处理消息框变化。
	var processMsgBox = {
			sendMsg: function(msg, toUserId, toGroupId) {
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
				
				// 3. 把 调整后的消息html标签字符串 添加到已发送用户消息表
				if (toUserId.length != 0) {
                    sentMessageMap.get(toUserId).push($('.newsList li').last().prop("outerHTML"));
				} else {
					sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
				}
				
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
            sendFirstReceive: function(msg, toUserId) {
			    console.log($(".bg .liRight .hidden-userId").html())
                console.log(toUserId)

                // 1. 把内容添加到消息框
                $('.newsList-temp').append(msg);

                // 2. 手动计算、调整回显消息的宽度
                var $newsDiv = $('.newsList-temp li').last().children("div").first();
                var fixWidth = 300; // 自定义的消息框本身的最长宽度
                var maxWidth = 493; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
                var minMarginLeftWidth = 224; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
                var marginLeftWidth; // 要计算消息框的margin-left宽度
                if ($newsDiv.actual('width') < fixWidth) {
                    marginLeftWidth = maxWidth - $newsDiv.actual('width');
                    $newsDiv.css("margin-left", marginLeftWidth + "px");
                } else {
                    $newsDiv.css("width", fixWidth + "px")
                        .css("margin-left", minMarginLeftWidth + "px");
                }

                // 3. 把 调整后的消息html标签字符串 添加到已发送用户消息表
                // if (toUserId.length != 0) {
                    sentMessageMap.get(toUserId).push($('.newsList-temp li').last().prop("outerHTML"));
                // } else {
                //     sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
                // }

                if($(".bg .liRight .hidden-userId").html() == toUserId){
                    $('.newsList').append($('.newsList-temp li').last().prop("outerHTML"));
                }
                $('.newsList-temp').empty();
                // 4. 滚动条往底部移
                // $(".conRight .headName").html("测试")
                // $("#toUserId").val(toUserId);
                $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight );
            },
			receiveSingleMsg: function(msg, fromUserId) {
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
                console.log($('.newsList-temp li').last().prop("outerHTML"))
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
            var $newsDiv = $('.newsList-temp li').last().children("div").first();
            var fixWidth = 300; // 自定义的消息框本身的最长宽度
            var maxWidth = 493; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
            var minMarginLeftWidth = 224; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
            var marginLeftWidth; // 要计算消息框的margin-left宽度
            console.log($newsDiv.actual('width'))
            console.log(fixWidth)

            if ($newsDiv.actual('width') < fixWidth) {
                marginLeftWidth = maxWidth - $newsDiv.actual('width');
                $newsDiv.css("margin-left", marginLeftWidth + "px");
            } else {
                console.log(456)
                $newsDiv.css("width", fixWidth + "px")
                    .css("margin-left", minMarginLeftWidth + "px");
                console.log("$newsDiv",$('.newsList-temp li').last().prop("outerHTML"));
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
	    
		receiving: function(content, $receiveLi,obj) {
	        console.log($receiveLi)
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
            obj.find('ul').prepend($receiveLi.prop("outerHTML"));
            obj.find('ul li').first().on('click',friendLiClickEvent);
	        $receiveLi.remove();
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
	            // console.log(this.elements)
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