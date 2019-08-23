package com.yiding.service;

import com.alibaba.fastjson.JSONObject;
import com.yiding.dto.CustomDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.MsgDto;
import com.yiding.dto.PageDto;
import io.netty.channel.ChannelHandlerContext;

public interface CustomService {
//    增
    void insertCustom(CustomDto customDto) throws Exception ;
//    改/删
    void updateCustom(CustomDto customDto, ManagerDto mDto) throws Exception;
//    查
//    按页查询
    Boolean selectCustomByPage(PageDto pageDto, CustomDto customDto, Byte sortStr, Byte openStr, ManagerDto mDto) throws Exception;
//    按id查询
    CustomDto selectCustomById(CustomDto customDto, Byte isDeal, Byte isFollow, ManagerDto mDto) throws Exception;

    void updateAllCustom() throws Exception ;


}
