package com.yiding.action.websocket;


import com.alibaba.fastjson.JSONObject;
import com.yiding.common.*;
import com.yiding.dto.*;
import com.yiding.pojo.ManagerVisitor;
import com.yiding.pojo.Visitor;
import com.yiding.service.*;
import io.netty.channel.ChannelHandler.Sharable;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PingWebSocketFrame;
import io.netty.handler.codec.http.websocketx.PongWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.MessageFormat;
import java.util.*;


@Component
@Sharable
public class WebSocketServerHandler extends SimpleChannelInboundHandler<WebSocketFrame> {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketServerHandler.class);
    
    @Autowired
    private ManagerService managerService;
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private LogService logService;
    @Autowired
    private RedisBaiseTakes redisTakes;
    @Autowired
    private ManagerVisitorService managerVisitorService;
    /**
     * 描述：读取完连接的消息后，对消息进行处理。
     *      这里主要是处理WebSocket请求
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame msg) throws Exception {
        handlerWebSocketFrame(ctx, msg);
    }
    
    /**
     * 描述：处理WebSocketFrame
     * @param ctx
     * @param frame
     * @throws Exception
     */
    private void handlerWebSocketFrame(ChannelHandlerContext ctx, WebSocketFrame frame) throws Exception {
        // 关闭请求
        if (frame instanceof CloseWebSocketFrame) {
            WebSocketServerHandshaker handshaker = 
                    Constant.webSocketHandshakerMap.get(ctx.channel().id().asLongText());
            if (handshaker == null) {
                sendErrorMessage(ctx, "不存在的客户端连接！");
            } else {
                handshaker.close(ctx.channel(), (CloseWebSocketFrame) frame.retain());
            }
            return;
        }
        // ping请求
        if (frame instanceof PingWebSocketFrame) {
            ctx.channel().write(new PongWebSocketFrame(frame.content().retain()));
            return;
        }
        // 只支持文本格式，不支持二进制消息
        if (!(frame instanceof TextWebSocketFrame)) {
            sendErrorMessage(ctx, "仅支持文本(Text)格式，不支持二进制消息");
        }

        // 客服端发送过来的消息
        String request = ((TextWebSocketFrame)frame).text();
        LOGGER.info("服务端收到新信息：" + request);
        JSONObject param = null;
        try {
            param = JSONObject.parseObject(request);
        } catch (Exception e) {
            sendErrorMessage(ctx, "JSON字符串转换出错！");
            e.printStackTrace();
        }
        if (param == null) {
            sendErrorMessage(ctx, "参数为空！");
            return;
        }

        String type = (String) param.get("type");
        ResResult result = new ResResult();
        switch (type) {
            case "REGISTER":
                System.out.println("置业顾问上线");
                ManagerDto managerDto = managerService.register(param, ctx);
//                将该名客服放至在线客服列表中
                Constant.onlineAdviserMap.put(managerDto.getManagerId().toString(), ctx);
                Constant.adviserInfoMap.put(managerDto.getManagerId().toString(),managerDto);
                Constant.adviserToVisitorListMap.put(managerDto.getManagerId().toString(), new HashMap<String, VisitorDto>());
//                Constant.adviserInfoMap.put(managerDto.getManagerId().toString(),managerDto);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
                result.setData(managerDto.toString());
//                获取在线访客列表
                Map onLineVisitorMap1 = (Map) redisTakes.getObj("onLineVisitor",managerDto.getManagerId().toString());
                result.setVisitorInfoMap(onLineVisitorMap1);
                result.setType(type);
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                ChannelHandlerContext toUserCtx1;
                ChannelHandlerContext toUserCtx_Manager;

//                向在线的访客更新客服列表
                for (VisitorDto dto :  Constant.visitorInfoMap.values()) {
//                    if(dto.getManagerId() != managerDto.getManagerId()){
                    toUserCtx1 = Constant.onlineVisitorMap.get(dto.getVisitorId().toString());
                    result.setAdviserInfoMap(Constant.adviserInfoMap);
                    result.setType("REGISTER_USER");
                    toUserCtx1.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
//                    }

                }
                for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                    result.setManagerDto(managerDto);
                    toUserCtx_Manager = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                    result.setType("REGISTER_ADVISER");
                    toUserCtx_Manager.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }
                break;
            case "REGISTER_MANAGER":
                System.out.println("管理员上线");
                ManagerDto managerDto_manager = managerService.register(param, ctx);
//                将该名客服放至在线客服列表中
                Constant.onlineManagerMap.put(managerDto_manager.getManagerId().toString(), ctx);
                Constant.managerInfoMap.put(managerDto_manager.getManagerId().toString(),managerDto_manager);
//                Constant.adviserToVisitorListMap.put(managerDto_manager.getManagerId().toString(), new HashMap<String, VisitorDto>());
//                Constant.adviserInfoMap.put(managerDto.getManagerId().toString(),managerDto);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
//                result.setData(managerDto_manager.toString());
//                获取在线访客列表
                Map onLineVisitorMap3 = (Map) redisTakes.getByKey("onLineVisitor");
                result.setVisitorInfoMap(onLineVisitorMap3);
                List onlineList = new ArrayList();
                Iterator<Map.Entry<String, Map<String,VisitorDto>>> iterator = onLineVisitorMap3.entrySet().iterator();
                while (iterator.hasNext()) {
                    Map.Entry<String, Map<String,VisitorDto>> entry = iterator.next();
                    ManagerDto managerDto1 = new ManagerDto();
                    System.out.println(entry.getKey());
                    if(!entry.getKey().equals("0")){
                        managerDto1.setManagerId(Long.valueOf(entry.getKey()));
                        managerDto1 = managerService.selectManagerById(managerDto1);

                    }else{
                        managerDto1.setManagerId(Long.valueOf(entry.getKey()));
                        managerDto1.setManagerName("所有访客");
                    }
                    managerDto1.setVisitorDtoMap(entry.getValue());
                    onlineList.add(managerDto1);
                }
                result.setType(type);
                result.setData(onlineList);
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
//                ChannelHandlerContext toUserCtx1;
//                向在线的访客更新客服列表
//                for (VisitorDto dto :  Constant.visitorInfoMap.values()) {
//                    if(dto.getManagerId() != managerDto.getManagerId()){
//                    toUserCtx1 = Constant.onlineVisitorMap.get(dto.getVisitorId().toString());
//                    result.setAdviserInfoMap(Constant.adviserInfoMap);
//                    result.setType("REGISTER_USER");
//                    toUserCtx1.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
//                    }
//                }
                break;
            case "REGISTER_USER":
                VisitorDto visitorDto = visitorService.register(param, ctx);
//                将该名访客放至在线访客列表中
                Constant.onlineVisitorMap.put(visitorDto.getVisitorId().toString(), ctx);
//                Constant.adviserInfoMap.put(managerDto.getManagerId().toString(),managerDto);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
                result.setData(visitorDto.toString());
//                获取在线的客服列表
                result.setAdviserInfoMap(Constant.adviserInfoMap);
                result.setType(type);
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                ChannelHandlerContext toUserCtx2;
                ChannelHandlerContext toUserCtx_Manager2;

//                向在线的客服更新访客列表
//                Map onLineVisitorMap = (Map) redisTakes.getObj("onLineVisitor","0");
//                if(onLineVisitorMap == null){
//                    onLineVisitorMap = new HashMap();
//                }
//                onLineVisitorMap.put(visitorDto.getVisitorId(),visitorDto);
                redisTakes.addObj("onLineVisitor","0",Constant.visitorInfoMap,Long.valueOf(1*24*60*60));
                for (ManagerDto dto :  Constant.adviserInfoMap.values()) {
//                    if(dto.getManagerId() != customDto.getManagerId()){
                        toUserCtx2 = Constant.onlineAdviserMap.get(dto.getManagerId().toString());
                        Map onLineVisitorMap2 = (Map) redisTakes.getObj("onLineVisitor",dto.getManagerId().toString());
                        try{
                            if(onLineVisitorMap2.get(visitorDto.getVisitorId()) != null){
                                result.setVisitorInfoMap(onLineVisitorMap2);
                                result.setType("REGISTER");
                                toUserCtx2.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                            }
                        }catch (Exception e){
                            System.out.println(e);
                        }

//                    }
                }
                for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                    toUserCtx_Manager2 = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                    result.setType("REGISTER_USER");
                    result.setVisitorDto(visitorDto);
                    toUserCtx_Manager2.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }

                break;
            case "SINGLE_SENDING":
                MsgDto msgDto = new MsgDto();
                String fromUserId = param.get("fromUserId").toString();
                String toUserId = param.get("toUserId").toString();
                String content = param.get("content").toString();
                msgDto.setContent(content);
                msgDto.setFormId(fromUserId);
                msgDto.setToId(toUserId);
                msgDto.setDate(DateUtills.dateToTimeString(new Date()));
                VisitorDto visitorDto_user = visitorService.selectVisitorById(Long.valueOf(toUserId));
                ManagerDto managerDto_user = new ManagerDto();
                managerDto_user.setManagerId(Long.valueOf(fromUserId));
                managerDto_user = managerService.selectManagerById(managerDto_user);
                result.setVisitorDto(visitorDto_user);
                result.setManagerDto(managerDto_user);
                if(msgDto == null){
                    result.setCode(Code.FAIL.getValue());
                    result.setMessage(Code.FAIL.getName());
                    ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }else{
                    LogDto logDto = new LogDto();
                    logDto.setManagerId(Long.valueOf(fromUserId));
                    logDto.setVisitorId(Long.valueOf(toUserId));
                    logDto.setLogContent(content);
                    logDto.setLogType(Byte.valueOf("1"));
//                    向访客发送客服信息
                    result.setCode(Code.SUCCESS.getValue());
                    result.setMessage(Code.SUCCESS.getName());
                    result.setData(msgDto);
                    try {
                        ChannelHandlerContext toUserCtx3 = Constant.onlineVisitorMap.get(msgDto.getToId());
                        logDto.setLogSuccess(Byte.valueOf("1"));

                        result.setType("SINGLE_SENDING_USER");
                        toUserCtx3.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                            result.setType("SINGLE_SENDING_ADVISER");
                            ChannelHandlerContext toUserCtx_M = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                            toUserCtx_M.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        }
                        String AKey = "AdvierLog_"+fromUserId;
                        String UKey = "UserLog_"+toUserId;
                        Map chatMap = (Map) redisTakes.getObj(UKey,AKey);
                        if(chatMap == null){
                            chatMap = new HashMap();
                        }else{
                            if(chatMap.size() >= 10){
                                for (Object key : chatMap.keySet()) {
//                                    System.out.println("Key = " + key);
                                    if(key == "9"){
                                        chatMap.put(key,msgDto);
                                    }else{
                                        String s = String.valueOf(Integer.valueOf((String) key) + 1);
                                        MsgDto o = (MsgDto) chatMap.get(s);
                                        chatMap.put(key,o);
                                    }
                                }
                            }else{
                                chatMap.put(chatMap.size(),msgDto);
                            }
                        }
//                        chatMap.put(chatMap.size(),msgDto);
                        redisTakes.addObj(UKey,AKey,chatMap,Long.valueOf(3*24*60*60));
                        logService.insertLog(logDto);
//                        chatMap = (Map) redisTakes.getObj(AKey,UKey);
                    }catch (Exception e){
                        logDto.setLogSuccess(Byte.valueOf("0"));
                        logService.insertLog(logDto);
                        result.setType("OFFLINE");
                        ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                    }
                }

                break;
            case "GET_HISTORY":

                String fromUserId_history = param.get("adviserId").toString();
                String toUserId_history  = param.get("userId").toString();
                MsgDto msgDto_history = new MsgDto();
                msgDto_history.setFormId(fromUserId_history);
                msgDto_history.setToId(toUserId_history);
                msgDto_history.setDate(DateUtills.dateToTimeString(new Date()));
//                String content_history  = param.get("content").toString();
                VisitorDto visitorDto_history = visitorService.selectVisitorById(Long.valueOf(toUserId_history));
                ManagerDto managerDto_history = new ManagerDto();
                managerDto_history.setManagerId(Long.valueOf(fromUserId_history));
                managerDto_history = managerService.selectManagerById(managerDto_history);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
                result.setData(msgDto_history);
                String AKey_history = "AdvierLog_"+fromUserId_history;
                String UKey_history = "UserLog_"+toUserId_history;
                Map chatMap_history = (Map) redisTakes.getObj(UKey_history,AKey_history);
                if(chatMap_history == null){
                    chatMap_history = new HashMap();
                }
                result.setHistoryMap(chatMap_history);
                result.setType("GET_HISTORY_USER");
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                ChannelHandlerContext toUserCtx_history = Constant.onlineAdviserMap.get(fromUserId_history);
                result.setType("GET_HISTORY");
                result.setVisitorDto(visitorDto_history);
                toUserCtx_history.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                Map onLineVisitorMap_history = (Map) redisTakes.getObj("onLineVisitor", fromUserId_history);
                if (onLineVisitorMap_history == null) {
                    onLineVisitorMap_history = new HashMap();
                }
                onLineVisitorMap_history.put(visitorDto_history.getVisitorId(), visitorDto_history);
                redisTakes.addObj("onLineVisitor", fromUserId_history, Constant.visitorInfoMap, Long.valueOf(1 * 24 * 60 * 60));
//                Map onLineVisitorMap_history0 = (Map) redisTakes.getObj("onLineVisitor", "0");

                for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                    toUserCtx_Manager2 = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                    result.setType("GET_HISTORY_MANAGER");
                    result.setVisitorDto(visitorDto_history);
                    result.setManagerDto(managerDto_history);
                    toUserCtx_Manager2.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }

                ManagerVisitor managerVisitor = new ManagerVisitor();
                managerVisitor.setManagerId(Long.valueOf(param.get("adviserId").toString()));
                managerVisitor.setVisitorId(visitorDto_history.getVisitorId());
                managerVisitorService.insert(managerVisitor);

                break;
            case "SINGLE_FIRST_SENDING":
                MsgDto msgDto2 = new MsgDto();
                String fromUserId1 = param.get("fromUserId").toString();
                String toUserId1 = param.get("toUserId").toString();
                VisitorDto visitorDto1 = visitorService.selectVisitorById(Long.valueOf(toUserId1));
                ManagerDto managerDto1 = new ManagerDto();
                managerDto1.setManagerId(Long.valueOf(fromUserId1));
                managerDto1 = managerService.selectManagerById(managerDto1);

//                因从数据库中获取客服的开场白
//                String content1 = param.get("content").toString();
                String content1 = "您好，我是高级置业顾问"+managerDto1.getManagerName()+"，有什么能帮助您？";
                msgDto2.setContent(content1);
                msgDto2.setFormId(fromUserId1);
                msgDto2.setToId(toUserId1);
                msgDto2.setDate(DateUtills.dateToTimeString(new Date()));
                if(!content1.equals("")){
                    LogDto logDto2 = new LogDto();
                    logDto2.setManagerId(Long.valueOf(fromUserId1));
                    logDto2.setVisitorId(Long.valueOf(toUserId1));
                    logDto2.setLogContent(content1);
                    logDto2.setLogType(Byte.valueOf("1"));
                    logDto2.setLogSuccess(Byte.valueOf("1"));
                    logService.insertLog(logDto2);
                }
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
                result.setData(msgDto2);
                String AKey1 = "AdvierLog_"+fromUserId1;
                String UKey1 = "UserLog_"+toUserId1;
                Map chatMap1 = (Map) redisTakes.getObj(UKey1,AKey1);
                if(chatMap1 == null){
                    chatMap1 = new HashMap();
                }
//                result.setHistoryMap(chatMap1);
                result.setType("SINGLE_SENDING_FIRST");
                result.setManagerDto(managerDto1);
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                ChannelHandlerContext toUserCtx5 = Constant.onlineVisitorMap.get(msgDto2.getToId());
                result.setType("SINGLE_SENDING_USER_FIRST");
                result.setVisitorDto(visitorDto1);
                toUserCtx5.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));

                for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                    result.setType("SINGLE_SENDING_FIRST_MANAGER");
                    ChannelHandlerContext toUserCtx_M = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                    toUserCtx_M.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }

                if(!content1.equals("")) {
                    if (chatMap1.size() >= 10) {
                        for (Object key : chatMap1.keySet()) {
//                                    System.out.println("Key = " + key);
                            if (key == "9") {
                                chatMap1.put(key, msgDto2);
                            } else {
                                String s = String.valueOf(Integer.valueOf((String) key) + 1);
                                MsgDto o = (MsgDto) chatMap1.get(s);
                                chatMap1.put(key, o);
                            }
                        }
                    } else {
                        chatMap1.put(chatMap1.size(), msgDto2);
                    }

//                chatMap1.put(chatMap1.size(),msgDto2);
                    redisTakes.addObj(UKey1, AKey1, chatMap1, Long.valueOf(3 * 24 * 60 * 60));
//                    Map onLineVisitorMap = (Map) redisTakes.getObj("onLineVisitor", fromUserId1);
//                    if (onLineVisitorMap == null) {
//                        onLineVisitorMap = new HashMap();
//                    }
//                    onLineVisitorMap.put(visitorDto1.getVisitorId(), visitorDto1);
//                    redisTakes.addObj("onLineVisitor", fromUserId1, Constant.visitorInfoMap, Long.valueOf(1 * 24 * 60 * 60));
                }

                break;
            case "SINGLE_PRODUCT_USER":
                String fromUserId_product = param.get("fromUserId").toString();
                String toUserId_product = param.get("toUserId").toString();
                String productId = param.get("productId").toString();
                String productName = param.get("productName").toString();
                String productImg = param.get("productImg").toString();
                String productPrice = param.get("productPrice").toString();
                String msgType = param.get("msgType").toString();
                String content_product = "["+(msgType.equals("build") ? "楼盘":"二手房")+"信息] "+productName+"";
                MsgDto msgDto_product = new MsgDto();
//        ChannelHandlerContext toUserCtx = Constant.onlineAdviserMap.get(toUserId);
//        if (toUserCtx != null) {
//                msgDto_product.setContent(content);
                msgDto_product.setFormId(fromUserId_product);
                msgDto_product.setToId(toUserId_product);
                msgDto_product.setDate(DateUtills.dateToTimeString(new Date()));
                msgDto_product.setContent(content_product);

                Map paremMap = new HashMap();
                paremMap.put("msgType",msgType);
                paremMap.put("productId",productId);
                paremMap.put("productName",productName);
                paremMap.put("productImg",productImg);
                paremMap.put("productPrice",productPrice);

                if(msgDto_product == null){
                    result.setCode(Code.FAIL.getValue());
                    result.setMessage(Code.FAIL.getName());
                    ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }else{
                    LogDto logDto = new LogDto();
                    logDto.setManagerId(Long.valueOf(toUserId_product));
                    logDto.setVisitorId(Long.valueOf(fromUserId_product));
                    logDto.setLogContent(content_product);
                    logDto.setLogType(Byte.valueOf("0"));
                    VisitorDto visitorDto_adv = visitorService.selectVisitorById(Long.valueOf(fromUserId_product));
                    ManagerDto managerDto_adv = new ManagerDto();
                    managerDto_adv.setManagerId(Long.valueOf(toUserId_product));
                    managerDto_adv = managerService.selectManagerById(managerDto_adv);
                    paremMap.put("VisitorDto",visitorDto_adv);

                    result.setVisitorDto(visitorDto_adv);
                    result.setManagerDto(managerDto_adv);
                    msgDto_product.setObjData(paremMap);
                    String AKey_product = "AdvierLog_"+toUserId_product;
                    String UKey_product = "UserLog_"+fromUserId_product;
                    Map chatMap_history_p = (Map) redisTakes.getObj(UKey_product,AKey_product);
                    if(chatMap_history_p == null){
                        chatMap_history_p = new HashMap();
                    }
                    result.setHistoryMap(chatMap_history_p);
                    try {
                        ChannelHandlerContext toUserCtx4 = Constant.onlineAdviserMap.get(msgDto_product.getToId());
                        logDto.setLogSuccess(Byte.valueOf("1"));

                        result.setCode(Code.SUCCESS.getValue());
                        result.setMessage(Code.SUCCESS.getName());
                        result.setData(msgDto_product);
                        result.setType("SINGLE_PRODUCT");
                        toUserCtx4.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                            paremMap.put("ManagerDto",managerDto_adv);
                            result.setType("SINGLE_PRODUCT_USER");
                            ChannelHandlerContext toUserCtx_M = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                            toUserCtx_M.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        }
                        logService.insertLog(logDto);
                        String AKey = "AdvierLog_"+param.get("toUserId").toString();
                        String UKey = "UserLog_"+param.get("fromUserId").toString();
                        Map chatMap = (Map) redisTakes.getObj(UKey,AKey);
                        if(chatMap == null){
                            chatMap = new HashMap();
                        }else{
                            if(chatMap.size() >= 10){
                                for (Object key : chatMap.keySet()) {
//                                    System.out.println("Key = " + key);
                                    if(key == "9"){
                                        chatMap.put(key,msgDto_product);
                                    }else{
                                        String s = String.valueOf(Integer.valueOf((String) key) + 1);
                                        MsgDto o = (MsgDto) chatMap.get(s);
                                        chatMap.put(key,o);
                                    }
                                }
                            }else{
                                chatMap.put(chatMap.size(),msgDto_product);
                            }
                        }

                        redisTakes.addObj(UKey,AKey,chatMap,Long.valueOf(3*24*60*60));
//                        chatMap = (Map) redisTakes.getObj(AKey,UKey);
                    }catch (Exception e){
                        logDto.setLogSuccess(Byte.valueOf("0"));
                        logService.insertLog(logDto);
                        result.setCode(Code.SUCCESS.getValue());
                        result.setMessage(Code.SUCCESS.getName());
                        result.setData(msgDto_product);
                        result.setType("OFFLINE_USER");
                        ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                    }
                }

                break;
            case "SINGLE_SENDING_USER":
                MsgDto msgDto1 = visitorService.singleSend(param, ctx);
                msgDto1.setDate(DateUtills.dateToTimeString(new Date()));
                if(msgDto1 == null){
                    result.setCode(Code.FAIL.getValue());
                    result.setMessage(Code.FAIL.getName());
                    ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                }else{
                    LogDto logDto = new LogDto();
                    logDto.setManagerId(Long.valueOf(param.get("toUserId").toString()));
                    logDto.setVisitorId(Long.valueOf(param.get("fromUserId").toString()));
                    logDto.setLogContent(param.get("content").toString());
                    logDto.setLogType(Byte.valueOf("0"));
                    VisitorDto visitorDto_adv = visitorService.selectVisitorById(Long.valueOf(param.get("fromUserId").toString()));
                    ManagerDto managerDto_adv = new ManagerDto();
                    managerDto_adv.setManagerId(Long.valueOf(param.get("toUserId").toString()));
                    managerDto_adv = managerService.selectManagerById(managerDto_adv);
                    result.setVisitorDto(visitorDto_adv);
                    result.setManagerDto(managerDto_adv);
                    try {
                        ChannelHandlerContext toUserCtx4 = Constant.onlineAdviserMap.get(msgDto1.getToId());
                        logDto.setLogSuccess(Byte.valueOf("1"));

                        result.setCode(Code.SUCCESS.getValue());
                        result.setMessage(Code.SUCCESS.getName());
                        result.setData(msgDto1);
                        result.setType("SINGLE_SENDING");
                        toUserCtx4.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        for (ManagerDto dto :  Constant.managerInfoMap.values()) {
                            result.setType("SINGLE_SENDING_USER");
                            ChannelHandlerContext toUserCtx_M = Constant.onlineManagerMap.get(dto.getManagerId().toString());
                            toUserCtx_M.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                        }
                        logService.insertLog(logDto);
                        String AKey = "AdvierLog_"+param.get("toUserId").toString();
                        String UKey = "UserLog_"+param.get("fromUserId").toString();
                        Map chatMap = (Map) redisTakes.getObj(UKey,AKey);
                        if(chatMap == null){
                            chatMap = new HashMap();
                        }else{
                            if(chatMap.size() >= 10){
                                for (Object key : chatMap.keySet()) {
//                                    System.out.println("Key = " + key);
                                    if(key == "9"){
                                        chatMap.put(key,msgDto1);
                                    }else{
                                        String s = String.valueOf(Integer.valueOf((String) key) + 1);
                                        MsgDto o = (MsgDto) chatMap.get(s);
                                        chatMap.put(key,o);
                                    }
                                }
                            }else{
                                chatMap.put(chatMap.size(),msgDto1);
                            }
                        }

                        redisTakes.addObj(UKey,AKey,chatMap,Long.valueOf(3*24*60*60));
//                        chatMap = (Map) redisTakes.getObj(AKey,UKey);
                    }catch (Exception e){
                        logDto.setLogSuccess(Byte.valueOf("0"));
                        logService.insertLog(logDto);
                        result.setCode(Code.SUCCESS.getValue());
                        result.setMessage(Code.SUCCESS.getName());
                        result.setData(msgDto1);
                        result.setType("OFFLINE_USER");
                        ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                    }
                }

                break;
//            case "GROUP_SENDING":
//                managerService.groupSend(param, ctx);
//                break;
//            case "FILE_MSG_SINGLE_SENDING":
//                managerService.FileMsgSingleSend(param, ctx);
//                break;
//            case "FILE_MSG_GROUP_SENDING":
//                managerService.FileMsgGroupSend(param, ctx);
//                break;
            default:

                result.setCode(Code.FAIL.getValue());
                result.setMessage(Code.FAIL.getName());
                ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
                break;
        }

    }
    
    /**
     * 描述：客户端断开连接
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
//        System.out.println(ctx.channel().id().asLongText());
//        managerService.removeFromChat(ctx);
        Iterator<Map.Entry<String, ChannelHandlerContext>> iterator =
                Constant.onlineAdviserMap.entrySet().iterator();
        Boolean is_visitor = true;
        Boolean is_manager = true;

        while(iterator.hasNext()) {
            Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
            if (entry.getValue() == ctx) {
                System.out.println(ctx);
                System.out.println(entry.getValue());
                LOGGER.info("正在移除握手实例...");
                Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
//                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
//                        , Constant.webSocketHandshakerMap.size()));
                String manageId = "";
                for (String key: Constant.onlineAdviserMap.keySet()) {
                    if(Constant.onlineAdviserMap.get(key).equals(entry.getValue())){
                        manageId = key;
                        break;
                    }
                }
                iterator.remove();
                Constant.adviserInfoMap.remove(manageId);
//                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
//                        , entry.getKey(), Constant.onlineAdviserMap.size()));
                is_visitor = false;
            }

        }
        if(is_visitor){
            iterator = Constant.onlineVisitorMap.entrySet().iterator();
            while(iterator.hasNext()) {
                Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
                if (entry.getValue() == ctx) {
//                LOGGER.info("正在移除握手实例...");
                    Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                        , Constant.webSocketHandshakerMap.size()));
                    String visitorId = "";
                    for (String key: Constant.onlineVisitorMap.keySet()) {
                        if(Constant.onlineVisitorMap.get(key).equals(entry.getValue())){
                            System.out.println(key);
                            visitorId = key;
                            break;
                        }
                    }
                    iterator.remove();
                    Constant.visitorInfoMap.remove(visitorId);
                    redisTakes.addObj("onLineVisitor","0",Constant.visitorInfoMap,Long.valueOf(1*24*60*60));
//                    从客服的接待用户列表中删除当前下线用户
                    for (String key: Constant.onlineAdviserMap.keySet()) {
                        Map onLineVisitor = (Map) redisTakes.getObj("onLineVisitor", key);
                        onLineVisitor.remove(visitorId);
                        redisTakes.addObj("onLineVisitor", key,onLineVisitor,Long.valueOf(1*24*60*60));
                    }
//                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
//                        , entry.getKey(), Constant.onlineVisitorMap.size()));
                    is_manager = false;
                    break;

                }

            }
        }
        if(is_manager){
            iterator = Constant.onlineManagerMap.entrySet().iterator();
            while(iterator.hasNext()) {
                Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
                if (entry.getValue() == ctx) {
//                LOGGER.info("正在移除握手实例...");
                    Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                    LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                            , Constant.webSocketHandshakerMap.size()));
                    String managerId = "";
                    for (String key: Constant.onlineManagerMap.keySet()) {
                        if(Constant.onlineManagerMap.get(key).equals(entry.getValue())){
                            System.out.println(key);
                            managerId = key;
                            break;
                        }
                    }
                    iterator.remove();
                    Constant.managerInfoMap.remove(managerId);
//                    redisTakes.addObj("onLineVisitor","0",Constant.managerInfoMap,Long.valueOf(1*24*60*60));
//                    从客服的接待用户列表中删除当前下线用户
//                    for (String key: Constant.onlineAdviserMap.keySet()) {
//                        Map onLineVisitor = (Map) redisTakes.getObj("onLineVisitor", key);
//                        onLineVisitor.remove(visitorId);
//                        redisTakes.addObj("onLineVisitor", key,onLineVisitor,Long.valueOf(1*24*60*60));
//                    }
//                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
//                        , entry.getKey(), Constant.onlineVisitorMap.size()));
                    break;
                }
            }
        }


    }
   
    /**
     * 异常处理：关闭channel
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
    
    
    private void sendErrorMessage(ChannelHandlerContext ctx, String errorMsg) {
//        String responseJson = new ResponseJson()
//                .error(errorMsg)
//                .toString();
//        ctx.channel().writeAndFlush(new TextWebSocketFrame(responseJson));
        ResResult result = new ResResult();
        result.setCode(Code.FAIL.getValue());
        result.setMessage(Code.FAIL.getName());
        ctx.channel().writeAndFlush(new TextWebSocketFrame(result.toString()));
    }

}
