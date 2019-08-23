package com.yiding.service.impl;

import com.yiding.common.DateUtills;
import com.yiding.dao.CustomMapper;
import com.yiding.dao.DealMapper;
import com.yiding.dao.FollowMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dto.CustomDto;
import com.yiding.dto.DealDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.pojo.Custom;
import com.yiding.pojo.Deal;
import com.yiding.pojo.Follow;
import com.yiding.pojo.Manager;
import com.yiding.service.DealService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("DealService")
public class DealServiceImpl implements DealService {

    @Resource
    DealMapper dealMapper;

    @Resource
    CustomMapper customMapper;

    @Resource
    ManagerMapper managerMapper;

    @Resource
    FollowMapper followMapper;

    @Override
    public DealDto selectDealById(DealDto dealDto) throws Exception{
        Deal deal = dealMapper.selectByPrimaryKey(dealDto.getDealId());
        BeanUtils.copyProperties(deal,dealDto);
        dealDto.setDealDate(DateUtills.dateToString(deal.getDealDate()));
        return dealDto;
    }

    @Override
    public boolean selectDealByPage(PageDto pageDto, DealDto dealDto, ManagerDto mDto, Byte sort) throws Exception{
        Map<String,Object> param=new HashMap<String,Object>();

        param.put("start",(pageDto.getPage()-1)*pageDto.getSize());
        param.put("size",pageDto.getSize());
        param.put("sort",sort);
        param.put("customId",dealDto.getCustomId());
        if(dealDto.getDealBuild() != null && !dealDto.getDealBuild().isEmpty()){
            String searchText=new StringBuilder("%").append(dealDto.getDealBuild()).append("%").toString();
            param.put("build",searchText);
        }
        if(dealDto.getManagerId() != null){
            param.put("managerId",dealDto.getManagerId());
        }else{
            if(mDto.getManagerPower() == 1){
                param.put("managerId",mDto.getManagerId());
            }else{
                param.put("managerId",null);
            }
        }

        pageDto.setAmount(dealMapper.getTotal(param));
        List<Deal> list = dealMapper.selectByPage(param);
        List<DealDto> dtoList = new ArrayList<>();
        if(list.isEmpty()){
            return false;
        }else {
            for (Deal pojo : list) {
                DealDto dto = new DealDto();
                CustomDto customDto = new CustomDto();
                ManagerDto managerDto = new ManagerDto();
                BeanUtils.copyProperties(pojo, dto);
                Custom custom = customMapper.selectByPrimaryKey(pojo.getCustomId());
                Manager manager = managerMapper.selectByPrimaryKey(pojo.getManagerId());
                BeanUtils.copyProperties(custom, customDto);
                BeanUtils.copyProperties(manager, managerDto);
                dto.setDealDate(DateUtills.dateToString(pojo.getDealDate()));
                dto.setManagerDto(managerDto);
                dto.setCustomDto(customDto);
                dtoList.add(dto);
            }
            pageDto.setList(dtoList);
            return true;
        }
    }

    @Override
    public void updateDeal(DealDto dealDto) throws Exception{
        Deal deal = new Deal();
        BeanUtils.copyProperties(dealDto,deal);
        dealMapper.updateByPrimaryKeySelective(deal);
//        如果删除成交记录，则将客户成交状态改为未成交
        if(dealDto.getDealDisplay() != null && dealDto.getDealDisplay() == 0 ){
            Custom custom = new Custom();
            custom.setCustomId(deal.getCustomId());
            custom.setCustomDeal(Byte.valueOf("0"));
            customMapper.updateByPrimaryKeySelective(custom);
        }
    }

    @Override
    public void insertDeal(DealDto dealDto, ManagerDto mDto) throws Exception{
        Deal deal = new Deal();
        BeanUtils.copyProperties(dealDto,deal);
        Date date = new Date();
        if(dealDto.getDealDate() != null){
            date = DateUtills.stringToDate(dealDto.getDealDate());
        }
        deal.setDealDate(date);
        dealMapper.insertSelective(deal);
        Custom custom = customMapper.selectByPrimaryKey(deal.getCustomId());
        custom.setCustomId(deal.getCustomId());
        custom.setCustomDeal(Byte.valueOf("1"));
        custom.setCustomUpdateTime(date);
        if(custom.getCustomState() == 1){
            custom.setCustomState(Byte.valueOf("0"));
        }
        customMapper.updateByPrimaryKeySelective(custom);
        //        成交操作跟进记录中
        Follow follow = new Follow();
        follow.setCustomId(dealDto.getCustomId());
        follow.setFollowDate(date);
        follow.setManagerId(mDto.getManagerId());
        follow.setFollowContent("[系统信息]:该账户添加成交记录成功");
        followMapper.insertSelective(follow);
    }
}
