package com.yiding.action.chataction;

import com.yiding.common.*;
import com.yiding.dto.*;
import com.yiding.pojo.Visitor;
import com.yiding.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/chatUser")
public class VisitorAction {
    @Autowired
    VisitorService visitorService;
    @Autowired
    private RedisBaiseTakes redisTakes;

    @RequestMapping("/insertVisitor")
    @ResponseBody
    public ResResult insertVisitor (HttpServletRequest request, VisitorDto visitorDto){
        ResResult result = new ResResult();
        try {
            HttpSession session = request.getSession();
            session.setAttribute("user", visitorDto);
            visitorService.insertVisitor(visitorDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
            Constant.visitorInfoMap.put(visitorDto.getVisitorId().toString(),visitorDto);
        }catch (Exception e){
            result.setCode(Code.CUSTOM_INSERT_FAIL.getValue());
            result.setMessage(Code.CUSTOM_INSERT_FAIL.getName());
        }
        return  result;
    }

    @RequestMapping("/getVisitor")
    @ResponseBody
    public ResResult getInfo(HttpServletRequest request ){
        ResResult result = new ResResult();
        //创建session对象
        HttpSession session = request.getSession();
        //取出在session域对象中
        VisitorDto visitorDto = (VisitorDto) session.getAttribute("user");
//        VisitorDto visitorDto1 = (VisitorDto) redisTakes.getObj("hello1",visitorDto.getVisitorId().toString());
        if(visitorDto == null ){
            result.setCode(Code.LOGIN_OUTTIME.getValue());
            result.setMessage(Code.LOGIN_OUTTIME.getName());
        }else{
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
            result.setData(visitorDto);
            result.setAdviserInfoMap(Constant.adviserInfoMap);
        }
        return result;
    }

    @RequestMapping("/selectVisitorByPage")
    @ResponseBody
    public ResResult selectVisitorByPage (PageDto pageDto, VisitorDto visitorDto, HttpServletRequest request){
        ResResult result = new ResResult();
        try {
            Byte sortStr = Byte.valueOf("0");
            Byte openStr = Byte.valueOf("0");
            if(request.getParameter("sort") != null && !request.getParameter("sort").equals("0")){
                sortStr = Byte.parseByte(request.getParameter("sort"));
            }
            HttpSession session = request.getSession();
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            if(visitorService.selectVisitorByPage(pageDto,visitorDto,sortStr,mDto)){
                result.setData(pageDto);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
            }else{
                result.setCode(Code.NO_RESULT.getValue());
                result.setMessage(Code.NO_RESULT.getName());
            }
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return  result;
    }

    @RequestMapping("/selectAllVisitorByPage")
    @ResponseBody
    public ResResult selectAllVisitorByPage (PageDto pageDto, VisitorDto visitorDto, HttpServletRequest request){
        ResResult result = new ResResult();
        try {
            Byte sortStr = Byte.valueOf("0");
            Byte openStr = Byte.valueOf("0");
            if(request.getParameter("sort") != null && !request.getParameter("sort").equals("0")){
                sortStr = Byte.parseByte(request.getParameter("sort"));
            }
            HttpSession session = request.getSession();
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            if(visitorService.selectAllVisitorByPage(pageDto,visitorDto,sortStr,mDto)){
                result.setData(pageDto);
                result.setCode(Code.SUCCESS.getValue());
                result.setMessage(Code.SUCCESS.getName());
            }else{
                result.setCode(Code.NO_RESULT.getValue());
                result.setMessage(Code.NO_RESULT.getName());
            }
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return  result;
    }

}
