package com.yiding.action.chataction;

import com.yiding.common.Code;
import com.yiding.common.Constant;
import com.yiding.common.Utills;
import com.yiding.dto.CustomDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.ResResult;
import com.yiding.service.CustomService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/chatUser")
public class CustomChatAction {

    @Resource
    CustomService customService;

    @RequestMapping("/insertCustom")
    @ResponseBody
    public ResResult insertCustom (HttpServletRequest request, CustomDto customDto){
        ResResult result = new ResResult();
        try {
            customService.insertCustom(customDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.CUSTOM_INSERT_FAIL.getValue());
            result.setMessage(Code.CUSTOM_INSERT_FAIL.getName());
        }
        return  result;
    }

    @RequestMapping("/updateCustom")
    @ResponseBody
    public ResResult updateCustom (HttpServletRequest request,CustomDto customDto){
        ResResult result = new ResResult();
        try {
            //创建session对象
            HttpSession session = request.getSession();
            //取出在session域对象中
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            customDto.setManagerId(mDto.getManagerId());
            customService.updateCustom(customDto,mDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.CUSTOM_UPDATE_FAIL.getValue());
            result.setMessage(Code.CUSTOM_UPDATE_FAIL.getName());
        }
        return  result;
    }

    @RequestMapping("/selectCustomByPage")
    @ResponseBody
    public ResResult selectCustomByPage (PageDto pageDto, CustomDto customDto,HttpServletRequest request){
        ResResult result = new ResResult();
        try {
            Byte sortStr = Byte.valueOf("0");
            Byte openStr = Byte.valueOf("0");
            if(request.getParameter("sort") != null && !request.getParameter("sort").equals("0")){
                sortStr = Byte.parseByte(request.getParameter("sort"));
            }
            if(request.getParameter("open") != null && !request.getParameter("open").equals("0")){
                openStr = Byte.parseByte(request.getParameter("open"));
            }
            HttpSession session = request.getSession();
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            if(customService.selectCustomByPage(pageDto,customDto,sortStr,openStr,mDto)){
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

    @RequestMapping("/selectCustomById")
    @ResponseBody
    public ResResult selectCustomById (CustomDto customDto,HttpServletRequest request){
        ResResult result = new ResResult();
        try {
            //是否带数据
            Byte isDeal = Byte.valueOf("0");
            Byte isFollow = Byte.valueOf("0");
            if(request.getParameter("isDeal") != null ){
                isDeal = Byte.parseByte(request.getParameter("isDeal"));
            }
            if(request.getParameter("isFollow") != null ){
                isFollow = Byte.parseByte(request.getParameter("isFollow"));
            }
            HttpSession session = request.getSession();
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            result.setData(customService.selectCustomById(customDto,isDeal,isFollow,mDto));
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return  result;
    }

    @ResponseBody
    @RequestMapping("/updateAllCustom")
    public ResResult updateAllCustom(){
        ResResult result=new ResResult();
        try {
            customService.updateAllCustom();
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return result;
    }

}
