package com.yiding.service.impl;

import com.yiding.common.DateUtills;
import com.yiding.dao.CustomMapper;
import com.yiding.dao.FollowMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dto.FollowDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.pojo.Custom;
import com.yiding.pojo.Follow;
import com.yiding.pojo.Manager;
import com.yiding.service.FollowService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("FollowService")
public class FollowServiceImpl implements FollowService{
    @Resource
    FollowMapper followMapper;

    @Resource
    CustomMapper customMapper;

    @Resource
    ManagerMapper managerMapper;

    @Override
    public void updateFollow(FollowDto followDto) throws Exception{
        Follow pojo = new Follow();
        BeanUtils.copyProperties(followDto,pojo);
        followMapper.updateByPrimaryKeySelective(pojo);
        Custom custom = new Custom();
        custom.setCustomId(pojo.getCustomId());
        custom.setCustomUpdateTime(new Date());
        customMapper.updateByPrimaryKeySelective(custom);
    }

    @Override
    public void insertFollow(FollowDto followDto) throws Exception{
        Follow pojo = new Follow();
        Date date = new Date();
        Date today = new Date();
        if(followDto.getFollowDate() != null){
            date = DateUtills.stringToDate(followDto.getFollowDate());
        }
        BeanUtils.copyProperties(followDto,pojo);
        pojo.setFollowDate(date);
        followMapper.insertSelective(pojo);
        Custom custom = customMapper.selectByPrimaryKey(pojo.getCustomId());
        custom.setCustomId(pojo.getCustomId());
        custom.setCustomUpdateTime(today);
        if(custom.getCustomState() == 1){
            custom.setCustomState(Byte.valueOf("0"));
        }
        customMapper.updateByPrimaryKeySelective(custom);
    }

    @Override
    public boolean selectFollowByPage(PageDto pageDto, FollowDto followDto, ManagerDto mDto) throws Exception{
        Map<String,Object> param=new HashMap<String,Object>();
//        CustomDto customDto = new CustomDto();

        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
        param.put("customId",followDto.getCustomId());
//        param.put("managerId",followDto.getManagerId());
        pageDto.setAmount(followMapper.getTotal(param));
        List<Follow> list = followMapper.selectByPage(param);
        List<FollowDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Follow pojo : list) {
                FollowDto dto = new FollowDto();
                ManagerDto managerDto = new ManagerDto();
                BeanUtils.copyProperties(pojo, dto);
//                Custom custom = customMapper.selectByPrimaryKey(pojo.getCustomId());
                Manager manager = managerMapper.selectByPrimaryKey(pojo.getManagerId());
//                BeanUtils.copyProperties(custom, customDto);
                BeanUtils.copyProperties(manager, managerDto);
                dto.setFollowDate(DateUtills.dateToString(pojo.getFollowDate()));
                dto.setManagerDto(managerDto);
//                dto.setCustomDto(customDto);
//               当前查看者为业务员时 （ 查看者ID与记录者ID不符 或 消息为系统消息时）不给予修改删除权利
                if(mDto.getManagerPower() == 1){
                    if( dto.getFollowContent().indexOf("[系统信息]") > -1 || mDto.getManagerId() != dto.getManagerId()){
                        dto.setCanOperate(Byte.valueOf("0"));
                    }
                }

                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }
    }
}
