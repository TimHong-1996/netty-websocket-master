package com.yiding.service;

import com.alibaba.fastjson.JSONObject;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.MsgDto;
import io.netty.channel.ChannelHandlerContext;

public interface ManagerService {
    void insertManager(ManagerDto managerDto) throws Exception;

    void updateManager(ManagerDto managerDto) throws Exception;

    boolean selectManagerByPage(PageDto pageDto, ManagerDto managerDto) throws Exception;

    ManagerDto selectManagerById(ManagerDto managerDto) throws Exception;

    void login(ManagerDto managerDto) throws Exception;

    String updatePassword(ManagerDto managerDto) throws Exception;

    void removeFromChat(ChannelHandlerContext ctx);

//    MsgDto singleSend(JSONObject param, ChannelHandlerContext ctx);

    ManagerDto register(JSONObject param, ChannelHandlerContext ctx);

    void exit(ManagerDto managerDto);
}
