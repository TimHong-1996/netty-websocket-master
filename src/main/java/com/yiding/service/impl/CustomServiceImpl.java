package com.yiding.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.yiding.common.Constant;
import com.yiding.common.DateUtills;
import com.yiding.dao.CustomMapper;
import com.yiding.dao.DealMapper;
import com.yiding.dao.FollowMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dto.*;
import com.yiding.pojo.Custom;
import com.yiding.pojo.Deal;
import com.yiding.pojo.Follow;
import com.yiding.pojo.Manager;
import com.yiding.service.CustomService;
import io.netty.channel.ChannelHandlerContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.MessageFormat;
import java.util.*;

@Service("CustomService")
public class CustomServiceImpl implements CustomService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManagerServiceImpl.class);

    @Resource
    CustomMapper customMapper;
    @Resource
    DealMapper dealMapper;
    @Resource
    FollowMapper followMapper;
    @Resource
    ManagerMapper managerMapper;

    @Override
    public void insertCustom(CustomDto customDto) throws Exception{
        Custom pojo = new Custom();
        BeanUtils.copyProperties(customDto,pojo);
        pojo.setCustomCreatTime(new Date());
        customMapper.insertSelective(pojo);
        BeanUtils.copyProperties(pojo,customDto);
    }

    @Override
    public void updateCustom(CustomDto customDto, ManagerDto mDto) throws Exception{
        Custom pojo = new Custom();
        Custom pojoOld = customMapper.selectByPrimaryKey(customDto.getCustomId());
        Date today = new Date();
        BeanUtils.copyProperties(customDto,pojo);
//        因添加跟进记录时，就对客户更新时间进行修改，此处不需要更改更新时间
        pojo.setCustomUpdateTime(today);
        if(pojoOld.getCustomState() == 1){
            pojo.setCustomState(Byte.valueOf("0"));
        }
        customMapper.updateByPrimaryKeySelective(pojo);
//        修改操作跟进记录中
        Follow follow = new Follow();
        follow.setCustomId(pojo.getCustomId());
        follow.setFollowDate(today);
        follow.setManagerId(mDto.getManagerId());
        follow.setFollowContent("[系统信息]:该账户修改客户资料成功");
        followMapper.insertSelective(follow);
    }

    @Override
    public Boolean selectCustomByPage(PageDto pageDto, CustomDto customDto, Byte sortStr, Byte openStr, ManagerDto mDto) throws Exception{
        Map<String,Object> param=new HashMap<String,Object>();
        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
        param.put("sex",customDto.getCustomSex());
        if(customDto.getCustomName() != null && !customDto.getCustomName().isEmpty()){
            String searchText=new StringBuilder("%").append(customDto.getCustomName()).append("%").toString();
            param.put("xingming",searchText);
        }
        if(customDto.getCustomSource() != null && !customDto.getCustomSource().isEmpty()){
            param.put("laiyuan",customDto.getCustomSource());
        }
        if(customDto.getCustomProvince() != null && !customDto.getCustomProvince().isEmpty()){
            param.put("sheng",customDto.getCustomProvince());
        }
        if(customDto.getCustomCity() != null && !customDto.getCustomCity().isEmpty()){
            param.put("shi",customDto.getCustomCity());
        }
        if(customDto.getCustomDeal() != null) param.put("chengjiao",customDto.getCustomDeal());
        if(customDto.getCustomState() != null) param.put("gongsi",customDto.getCustomState());
        param.put("sort",sortStr);
        param.put("open",openStr);  //0-all 1-si 2-gong
//        open = 1 即搜索私客，则需要获取当前使用者ID
        if(1 == openStr){
            param.put("managerId",mDto.getManagerId());
        }else{
//            当显示公客页面时，此处判断 管理员-所有客户（私客+公客）  业务员-公客
            if(mDto.getManagerPower() == 1){
                param.put("open","2");
            }else{
                param.put("open","0");
            }
            param.put("managerId",customDto.getManagerId());
        }

        pageDto.setAmount(customMapper.getTotal(param));
        List<Custom> list = customMapper.selectByPage(param);
        List<CustomDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Custom pojo : list) {
                CustomDto dto = new CustomDto();
                BeanUtils.copyProperties(pojo, dto);
                dto.setCustomCreatTime(DateUtills.dateToString(pojo.getCustomCreatTime()));
                dto.setCustomUpdateTime(DateUtills.dateToString(pojo.getCustomUpdateTime()));
//                权限为1 状态为0|1 记录id与当前查看者Id
//                当业务员查看全部数据时，判断其权限是否能看私客资料
//                if(mDto.getManagerPower() == 1){
//                    if(dto.getCustomState() < 2 && mDto.getManagerId() != dto.getManagerId()){
//                        if(!pojo.getCustomPhone().isEmpty())
//                        dto.setCustomPhone(new StringBuilder(pojo.getCustomPhone()).replace(3, 7,"****").toString());
//                        dto.setCanOperate(Byte.valueOf("0"));
//                    }
//                }
                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }


    }

    @Override
    public CustomDto selectCustomById(CustomDto customDto, Byte isDeal, Byte isFollow, ManagerDto mDto) throws Exception {
        Custom pojo = customMapper.selectByPrimaryKey(customDto.getCustomId());
        BeanUtils.copyProperties(pojo,customDto);

        Manager manager = managerMapper.selectByPrimaryKey(pojo.getManagerId());
        ManagerDto managerDto = new ManagerDto();
        BeanUtils.copyProperties(manager,managerDto);
        customDto.setManagerDto(managerDto);

        if(pojo.getCustomCreatTime() != null){
            customDto.setCustomCreatTime(DateUtills.dateToString(pojo.getCustomCreatTime()));
        }
        if(pojo.getCustomUpdateTime() != null){
            customDto.setCustomUpdateTime(DateUtills.dateToString(pojo.getCustomUpdateTime()));
        }
        if(1==isDeal){
            DealDto dealDto = new DealDto();
            Deal deal = dealMapper.selectByPrimaryKey(pojo.getCustomId());
            BeanUtils.copyProperties(deal,dealDto);
            customDto.setDealDto(dealDto);
        }
        if(1==isFollow){
            List<FollowDto> followDtoList = new ArrayList<>();
            Map<String,Object> param=new HashMap<String,Object>();
            param.put("start",0);
            param.put("size",10);
            param.put("customId",pojo.getCustomId());
            param.put("managerId",null);
            List<Follow> followList = followMapper.selectByPage(param);
            if(!followList.isEmpty()){
                for (Follow followpojo : followList) {
                    FollowDto dto = new FollowDto();
                    BeanUtils.copyProperties(pojo, dto);
                    dto.setFollowDate(DateUtills.dateToString(followpojo.getFollowDate()));
                    followDtoList.add(dto);
                }
                customDto.setFollowDtoList(followDtoList);
            }
        }
//                权限为1 当前查看者为业务员
//                当业务员查看数据时，判断其权限是否能看私客手机号
//        if(mDto.getManagerPower() == 1){
//            if(customDto.getCustomState() < 2 && mDto.getManagerId() != customDto.getManagerId()){
//                if(!pojo.getCustomPhone().isEmpty())
//                    customDto.setCustomPhone(new StringBuilder(pojo.getCustomPhone()).replace(3, 7,"****").toString());
//                customDto.setCanOperate(Byte.valueOf("0"));
//            }
//        }
        return customDto;
    }

    @Override
    @Scheduled(cron="10 0 0 * * ?")//每天凌晨0点0分10秒触发
    public void updateAllCustom() throws Exception {
        List<Custom> list = customMapper.selectAllUpdate();
        if(!list.isEmpty()){
            for (Custom pojo : list) {
                Date today = new Date();
                Date thatDay = null;
                if(pojo.getCustomUpdateTime() == null){
                    thatDay = pojo.getCustomCreatTime();
                }else{
                    thatDay = pojo.getCustomUpdateTime();
                }
                int days = DateUtills.differentDaysByMillisecond(thatDay,today);
                if(0 == pojo.getCustomState()){
                    if(days >= 7 && days < 15){
                        pojo.setCustomState(Byte.valueOf("1"));
                        customMapper.updateByPrimaryKeySelective(pojo);
                    }
                }else if(1 == pojo.getCustomState()) {
                    if (days >= 15) {
                        pojo.setCustomState(Byte.valueOf("2"));
                        customMapper.updateByPrimaryKeySelective(pojo);
                    }
                }
            }
        }
    }


}
