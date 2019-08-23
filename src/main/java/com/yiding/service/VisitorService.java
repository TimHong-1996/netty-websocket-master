package com.yiding.service;

import com.alibaba.fastjson.JSONObject;
import com.yiding.dto.*;
import io.netty.channel.ChannelHandlerContext;

public interface VisitorService {
    void insertVisitor(VisitorDto visitorDto) throws Exception;

    VisitorDto register(JSONObject param, ChannelHandlerContext ctx) throws Exception ;

    void removeFromChat(ChannelHandlerContext ctx) throws Exception ;

    MsgDto singleSend(JSONObject param, ChannelHandlerContext ctx) throws Exception ;

    void exit(VisitorDto visitorDto) throws Exception;

    VisitorDto selectVisitorById(Long toId) throws Exception;

    boolean selectVisitorByPage(PageDto pageDto, VisitorDto customDto, Byte sortStr, ManagerDto mDto) throws Exception;

    boolean selectAllVisitorByPage(PageDto pageDto, VisitorDto visitorDto, Byte sortStr, ManagerDto mDto) throws Exception;
}
