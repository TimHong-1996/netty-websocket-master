package com.yiding.service.impl;

import com.yiding.common.DateUtills;
import com.yiding.dao.LogMapper;
import com.yiding.dto.LogDto;
import com.yiding.dto.PageDto;
import com.yiding.pojo.Log;
import com.yiding.service.LogService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("LogService")
public class LogServiceImpl implements LogService {

    @Resource
    LogMapper logMapper;


    @Override
    public void insertLog(LogDto logDto) throws Exception {
        Log log = new Log();
        BeanUtils.copyProperties(logDto,log);
        log.setLogDate(new Date());
        logMapper.insertSelective(log);

    }

    @Override
    public void selectLogByIdAndPage(LogDto logDto, PageDto pageDto) throws Exception{
        Map param = new HashMap();
        param.put("start",(pageDto.getPage() - 1)*pageDto.getSize());
        param.put("size", pageDto.getSize());
        param.put("managerId",logDto.getManagerId());
        param.put("visitorId",logDto.getVisitorId());
        List<Log> logList = logMapper.selectLogByIdAndPage(param);
        List<LogDto> dtoList = new ArrayList<>();
        for ( Log pojo: logList) {
           LogDto dto = new LogDto();
           BeanUtils.copyProperties(pojo,dto);
           dto.setLogDate(DateUtills.dateToTimeString(pojo.getLogDate()));
           dtoList.add(dto);
        }
        pageDto.setList(dtoList);
    }
}
