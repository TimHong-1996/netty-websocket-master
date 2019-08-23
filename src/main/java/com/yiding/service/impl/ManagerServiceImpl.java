package com.yiding.service.impl;


import com.alibaba.fastjson.JSONObject;
import com.yiding.common.Constant;
import com.yiding.common.DateUtills;
import com.yiding.common.MD5;
import com.yiding.common.Utills;
import com.yiding.dao.CustomMapper;
import com.yiding.dao.DealMapper;
import com.yiding.dao.LogMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.MsgDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.ResResult;
import com.yiding.pojo.Deal;
import com.yiding.pojo.Log;
import com.yiding.pojo.Manager;
import com.yiding.service.ManagerService;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.MessageFormat;
import java.util.*;

@Service("ManagerService")
public class ManagerServiceImpl implements ManagerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManagerServiceImpl.class);
    @Resource
    ManagerMapper managerMapper;
    @Resource
    CustomMapper customMapper;
    @Resource
    DealMapper dealMapper;
    @Resource
    LogMapper logMapper;

    @Override
    public void insertManager(ManagerDto managerDto) throws Exception{
        Manager manager = new Manager();
        BeanUtils.copyProperties(managerDto,manager);
        manager.setManagerPassword(MD5.encodeByMD5("123456"));
        manager.setManagerCreateTime(new Date());
        managerMapper.insertSelective(manager);
    }

    @Override
    public void updateManager(ManagerDto managerDto) throws Exception{
        Manager manager = new Manager();
        BeanUtils.copyProperties(managerDto,manager);
        if(managerDto.getManagerPassword() != null){
            manager.setManagerPassword(MD5.encodeByMD5(managerDto.getManagerPassword()));
        }
        managerMapper.updateByPrimaryKeySelective(manager);
        manager = managerMapper.selectByPrimaryKey(manager.getManagerId());
        BeanUtils.copyProperties(manager,managerDto);
    }

    @Override
    public boolean selectManagerByPage(PageDto pageDto, ManagerDto managerDto) throws Exception{
        Map<String,Object> param=new HashMap<String,Object>();
        Map map = new HashMap();
        if(managerDto.getManagerName() != null && !managerDto.getManagerName().isEmpty()){
            String searchText=new StringBuilder("%").append(managerDto.getManagerName()).append("%").toString();
            param.put("xingming",searchText);
        }
        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
        pageDto.setAmount(managerMapper.getTotal(param));
        List<Manager> list = managerMapper.selectByPage(param);
        List<ManagerDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Manager pojo : list) {
                ManagerDto dto = new ManagerDto();
                BeanUtils.copyProperties(pojo, dto);
                dto.setManagerCreateTime(DateUtills.dateToString(pojo.getManagerCreateTime()));

                map.put("managerId",dto.getManagerId());
                map.put("open",1);
                dto.setCustomTotalNum(customMapper.getTotal(map));
                dto.setCustomDealNum(dealMapper.getDealCustomTotal(map));
                dto.setDealNum(dealMapper.getTotal(map));
                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }
    }

    @Override
    public ManagerDto selectManagerById(ManagerDto managerDto) throws Exception{
        Manager manager = managerMapper.selectByPrimaryKey(managerDto.getManagerId());
        BeanUtils.copyProperties(manager,managerDto);
        managerDto.setManagerCreateTime(DateUtills.dateToString(manager.getManagerCreateTime()));
        Map map = new HashMap();
        map.put("managerId",managerDto.getManagerId());
        map.put("open",1);
        managerDto.setCustomTotalNum(customMapper.getTotal(map));
        managerDto.setCustomDealNum(dealMapper.getDealCustomTotal(map));
        managerDto.setDealNum(dealMapper.getTotal(map));
        return managerDto;
    }

    @Override
    public void login(ManagerDto managerDto) throws Exception {
        Manager pojo = new Manager();
        BeanUtils.copyProperties(managerDto,pojo);
        pojo.setManagerPassword(MD5.encodeByMD5(managerDto.getManagerPassword()));
        pojo = managerMapper.login(pojo);
        BeanUtils.copyProperties(pojo,managerDto);
    }

    @Override
    public String updatePassword(ManagerDto managerDto) throws Exception{
        Manager manager = new Manager();
        BeanUtils.copyProperties(managerDto,manager);
        String new_pwd = "123456";
        manager.setManagerPassword(MD5.encodeByMD5(new_pwd));
        managerMapper.updateByPrimaryKeySelective(manager);
        return new_pwd;
    }

    @Override
    public void removeFromChat(ChannelHandlerContext ctx) {
        Iterator<Map.Entry<String, ChannelHandlerContext>> iterator =
                Constant.onlineAdviserMap.entrySet().iterator();
        while(iterator.hasNext()) {
            Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
            if (entry.getValue() == ctx) {
                System.out.println(entry.getValue());
                LOGGER.info("正在移除握手实例...");
                Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                        , Constant.webSocketHandshakerMap.size()));
                iterator.remove();
                Constant.adviserInfoMap.remove(entry.getValue());
                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
                        , entry.getKey(), Constant.onlineAdviserMap.size()));
                break;
            }
        }
    }

//    @Override
//    public MsgDto singleSend(JSONObject param, ChannelHandlerContext ctx) {
//        String fromUserId = param.get("fromUserId").toString();
//        String toUserId = param.get("toUserId").toString();
//        String content = param.get("content").toString();
//        MsgDto msgDto = new MsgDto();
//
////        ChannelHandlerContext toUserCtx = Constant.onlineVisitorMap.get(toUserId);
////        if (toUserCtx != null) {
//            msgDto.setContent(content);
//            msgDto.setFormId(fromUserId);
//            msgDto.setToId(toUserId);
//
////        }
////        Log log = new Log();
////        log.setManagerId(Long.valueOf(toUserId));
////        log.setVisitorId(Long.valueOf(fromUserId));
////        log.setLogType(Byte.valueOf("1"));
////        log.setLogContent(content);
////        log.setLogDate(new Date());
////        log.setLogSuccess(Byte.valueOf("1"));
////        logMapper.insert(log);
//        return msgDto;
//    }

    @Override
    public ManagerDto register(JSONObject param, ChannelHandlerContext ctx) {
        Long userId = Long.valueOf((int)param.get("userId"));
        Manager manager = managerMapper.selectByPrimaryKey(userId);
        ManagerDto managerDto = new ManagerDto();
        BeanUtils.copyProperties(manager,managerDto);
        return managerDto;
    }

    @Override
    public void exit(ManagerDto managerDto) {
        Iterator<Map.Entry<String, ChannelHandlerContext>> iterator =
                Constant.onlineAdviserMap.entrySet().iterator();
        while(iterator.hasNext()) {
            Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
            if (entry.getKey() == managerDto.getManagerId().toString()) {
                LOGGER.info("正在移除握手实例...");
//                Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                        , Constant.webSocketHandshakerMap.size()));
                iterator.remove();
                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
                        , entry.getKey(), Constant.onlineAdviserMap.size()));
                break;
            }
        }
    }
}
