package com.yiding.action.chataction;

import com.yiding.common.Code;
import com.yiding.common.RedisBaiseTakes;
import com.yiding.dto.*;
import com.yiding.service.LogService;
import com.yiding.service.ManagerService;
import com.yiding.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/chat")
public class LogAction {
    @Autowired
    LogService logService;
    @Autowired
    ManagerService managerService;
    @Autowired
    VisitorService visitorService;
    @Autowired
    private RedisBaiseTakes redisTakes;

    @RequestMapping("/getLogByID")
    @ResponseBody
    public ResResult getLogByID(HttpServletRequest request , LogDto logDto, PageDto pageDto){
        ResResult result = new ResResult();
        try {
            logService.selectLogByIdAndPage(logDto,pageDto);
            ManagerDto managerDto = new ManagerDto();
            managerDto.setManagerId(Long.valueOf(logDto.getManagerId()));
            result.setManagerDto(managerService.selectManagerById(managerDto));
            result.setVisitorDto(visitorService.selectVisitorById(logDto.getVisitorId()));
            result.setData(pageDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.CUSTOM_INSERT_FAIL.getValue());
            result.setMessage(Code.CUSTOM_INSERT_FAIL.getName());
        }
        return  result;
    }
}
