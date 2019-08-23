package com.yiding.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.yiding.common.Constant;
import com.yiding.common.DateUtills;
import com.yiding.common.Utills;
import com.yiding.dao.LogMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dao.VisitorMapper;
import com.yiding.dto.*;
import com.yiding.pojo.Manager;
import com.yiding.pojo.Visitor;
import com.yiding.service.VisitorService;
import io.netty.channel.ChannelHandlerContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.MessageFormat;
import java.util.*;

@Service("VisitorService")
public class VisitorServiceImpl implements VisitorService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManagerServiceImpl.class);

    @Resource
    VisitorMapper visitorMapper;

    @Resource
    LogMapper logMapper;

    @Resource
    ManagerMapper managerMapper;

    @Override
    public void removeFromChat(ChannelHandlerContext ctx) throws Exception {
        Iterator<Map.Entry<String, ChannelHandlerContext>> iterator =
                Constant.onlineVisitorMap.entrySet().iterator();
        while(iterator.hasNext()) {
            Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
            if (entry.getValue() == ctx) {
                LOGGER.info("正在移除握手实例...");
                Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                        , Constant.webSocketHandshakerMap.size()));
                iterator.remove();
                Constant.visitorInfoMap.remove(entry.getValue());
                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
                        , entry.getKey(), Constant.onlineVisitorMap.size()));
                break;
            }
        }
    }

    @Override
    public MsgDto singleSend(JSONObject param, ChannelHandlerContext ctx) throws Exception {
        String fromUserId = param.get("fromUserId").toString();
        String toUserId = param.get("toUserId").toString();
        String content = param.get("content").toString();
        MsgDto msgDto = new MsgDto();
//        ChannelHandlerContext toUserCtx = Constant.onlineAdviserMap.get(toUserId);
//        if (toUserCtx != null) {
            msgDto.setContent(content);
            msgDto.setFormId(fromUserId);
            msgDto.setToId(toUserId);
//        }
//        Log log = new Log();
//        log.setManagerId(Long.valueOf(toUserId));
//        log.setVisitorId(Long.valueOf(fromUserId));
//        log.setLogType(Byte.valueOf("0"));
//        log.setLogContent(content);
//        log.setLogDate(new Date());
//        log.setLogSuccess(Byte.valueOf("1"));
//        logMapper.insert(log);
         return msgDto;

    }

    @Override
    public void insertVisitor(VisitorDto visitorDto) throws Exception {
//        通过IP获取访客是否有记录
//        Visitor visitor = visitorMapper.selectByIP(visitorDto.getVisitorIp());
        Visitor visitor ;
        Date today = new Date();
//        if(visitor == null){
            visitor = new Visitor();
            BeanUtils.copyProperties(visitorDto,visitor);
            visitor.setVisitorCreateTime(today);
            visitor.setVisitorLastTime(today);

            visitor.setVisitorName("游客"+ Utills.getRandomPwd(6));
            visitorMapper.insertSelective(visitor);
//        }else{
//            visitor.setVisitorLastTime(today);
//            visitorMapper.updateByPrimaryKeySelective(visitor);
//        }
        BeanUtils.copyProperties(visitor,visitorDto);
        visitorDto.setVisitorCreateTime(DateUtills.dateToString(visitor.getVisitorCreateTime()));

    }

    @Override
    public VisitorDto register(JSONObject param, ChannelHandlerContext ctx) throws Exception {
        Long userId = Long.valueOf((int)param.get("userId"));
        Visitor visitor = visitorMapper.selectByPrimaryKey(userId);
        VisitorDto visitorDto = new VisitorDto();
        BeanUtils.copyProperties(visitor,visitorDto);
        return visitorDto;
    }

    @Override
    public void exit(VisitorDto visitorDto) throws Exception {
        Iterator<Map.Entry<String, ChannelHandlerContext>> iterator =
                Constant.onlineVisitorMap.entrySet().iterator();
        while(iterator.hasNext()) {
            Map.Entry<String, ChannelHandlerContext> entry = iterator.next();
            if (entry.getKey() == visitorDto.getVisitorId().toString()) {
                LOGGER.info("正在移除握手实例...");
//                Constant.webSocketHandshakerMap.remove(ctx.channel().id().asLongText());
                LOGGER.info(MessageFormat.format("已移除握手实例，当前握手实例总数为：{0}"
                        , Constant.webSocketHandshakerMap.size()));
                iterator.remove();
                LOGGER.info(MessageFormat.format("userId为 {0} 的用户已退出聊天，当前在线人数为：{1}"
                        , entry.getKey(), Constant.onlineVisitorMap.size()));
                break;
            }
        }
    }

    @Override
    public VisitorDto selectVisitorById(Long toId)  throws Exception{
        Visitor visitor = visitorMapper.selectByPrimaryKey(toId);
        VisitorDto visitorDto = new VisitorDto();
        BeanUtils.copyProperties(visitor,visitorDto);
        return visitorDto;
    }

    @Override
    public boolean selectVisitorByPage(PageDto pageDto, VisitorDto visitorDto, Byte sortStr, ManagerDto mDto) throws Exception{
        Map<String,Object> param=new HashMap<String,Object>();
        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
//        param.put("sex",customDto.getCustomSex());
        if(visitorDto.getVisitorName() != null && !visitorDto.getVisitorName().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("xingming",searchText);
        }
        if(visitorDto.getVisitorSourse() != null && !visitorDto.getVisitorSourse().isEmpty()){
            param.put("laiyuan",visitorDto.getVisitorSourse());
        }
        if(visitorDto.getVisitorProvince() != null && !visitorDto.getVisitorProvince().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("sheng",searchText);
        }
        if(visitorDto.getVisitorCity() != null && !visitorDto.getVisitorCity().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("shi",searchText);
        }
        if(visitorDto.getVisitorPlat() != null && !visitorDto.getVisitorPlat().isEmpty()) param.put("shebei",visitorDto.getVisitorPlat());
//        if(visitorDto.getCustomState() != null) param.put("gongsi",visitorDto.getCustomState());
        param.put("sort",sortStr);
        param.put("managerId",mDto.getManagerId());

        pageDto.setAmount(visitorMapper.getTotal(param));
        List<Visitor> list = visitorMapper.selectByPage(param);
        List<VisitorDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Visitor pojo : list) {
                VisitorDto dto = new VisitorDto();
                BeanUtils.copyProperties(pojo, dto);
                dto.setVisitorCreateTime(DateUtills.dateToString(pojo.getVisitorCreateTime()));
                dto.setVisitorLastTime(DateUtills.dateToString(pojo.getVisitorLastTime()));
                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }
    }

    @Override
    public boolean selectAllVisitorByPage(PageDto pageDto, VisitorDto visitorDto, Byte sortStr, ManagerDto mDto) throws Exception {
        Map<String,Object> param=new HashMap<String,Object>();
        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
//        param.put("sex",customDto.getCustomSex());
        if(visitorDto.getVisitorName() != null && !visitorDto.getVisitorName().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("xingming",searchText);
        }
        if(visitorDto.getVisitorSourse() != null && !visitorDto.getVisitorSourse().isEmpty()){
            param.put("laiyuan",visitorDto.getVisitorSourse());
        }
        if(visitorDto.getVisitorProvince() != null && !visitorDto.getVisitorProvince().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("sheng",searchText);
        }
        if(visitorDto.getVisitorCity() != null && !visitorDto.getVisitorCity().isEmpty()){
            String searchText=new StringBuilder("%").append(visitorDto.getVisitorName()).append("%").toString();
            param.put("shi",searchText);
        }
        if(visitorDto.getVisitorPlat() != null && !visitorDto.getVisitorPlat().isEmpty()) param.put("shebei",visitorDto.getVisitorPlat());
//        if(visitorDto.getCustomState() != null) param.put("gongsi",visitorDto.getCustomState());
        param.put("sort",sortStr);

        pageDto.setAmount(visitorMapper.getAllTotal(param));
        List<Visitor> list = visitorMapper.selectAllByPage(param);

        List<VisitorDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Visitor pojo : list) {
                List<Manager> managerList = managerMapper.selectAllAdviserByVisitorID(pojo.getVisitorId());
                List<ManagerDto> managerDtoList = new ArrayList<>();
                if(!managerList.isEmpty()){
                    for (Manager managerpojo: managerList) {
                        ManagerDto managerDto = new ManagerDto();
                        BeanUtils.copyProperties(managerpojo,managerDto);
                        managerDtoList.add(managerDto);
                    }
                }
                VisitorDto dto = new VisitorDto();
                BeanUtils.copyProperties(pojo, dto);
                dto.setVisitorCreateTime(DateUtills.dateToString(pojo.getVisitorCreateTime()));
                dto.setVisitorLastTime(DateUtills.dateToString(pojo.getVisitorLastTime()));
                dto.setManagerDtoList(managerDtoList);
                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }
    }
}
