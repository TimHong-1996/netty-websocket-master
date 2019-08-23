package com.yiding.action.backstageaction;

import com.yiding.common.Code;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.ResResult;
import com.yiding.service.ManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/backstage")
public class ManagerAction {
    @Resource
    ManagerService managerService;

    @RequestMapping("/login")
    @ResponseBody
    public ResResult login(HttpServletRequest request,ManagerDto managerDto){
        ResResult result = new ResResult();
        try{
            managerService.login(managerDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
            //创建session对象
            HttpSession session = request.getSession();
            //把用户数据保存在session域对象中
            session.setAttribute("user", managerDto);
        }catch (Exception e){
            System.out.println(e);
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return result;
    }

    //安全退出
    @RequestMapping("/exit")
    @ResponseBody
    public ResResult exit(HttpServletRequest request){
        ResResult result=new ResResult();
        try {
            //创建session对象
            HttpSession session = request.getSession();
            session.invalidate();
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/getInfo")
    @ResponseBody
    public ResResult getInfo(HttpServletRequest request ){
        ResResult result = new ResResult();

        //创建session对象
        HttpSession session = request.getSession();
        //取出在session域对象中
        ManagerDto managerDto = (ManagerDto) session.getAttribute("user");
        if(managerDto == null ){
            result.setCode(Code.LOGIN_OUTTIME.getValue());
            result.setMessage(Code.LOGIN_OUTTIME.getName());
        }else{
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
            result.setData(managerDto);
        }
        return result;
    }

    //超时登录
    @RequestMapping("/loginOverTime")
    @ResponseBody
    public ResResult loginOverTime(){
        ResResult result=new ResResult();
        result.setCode(Code.LOGIN_OUTTIME.getValue());
        result.setMessage(Code.LOGIN_OUTTIME.getName());
        return result;
    }

    @RequestMapping("/updatePassword")
    @ResponseBody
    public ResResult updatePassword(ManagerDto managerDto){
        ResResult result = new ResResult();
        try{
            result.setData(managerService.updatePassword(managerDto));
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            System.out.println(e);
            result.setCode(Code.MANAGER_RESET_PWD_FAIL.getValue());
            result.setMessage(Code.MANAGER_RESET_PWD_FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/insertManager")
    @ResponseBody
    public ResResult insertManager(ManagerDto managerDto){
        ResResult result = new ResResult();
        try{
            managerService.insertManager(managerDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.MANAGER_INSERT_FAIL.getValue());
            result.setMessage(Code.MANAGER_INSERT_FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/updateManager")
    @ResponseBody
    public ResResult updateManager(HttpServletRequest request ,ManagerDto managerDto){
        ResResult result = new ResResult();
        try{
            managerService.updateManager(managerDto);
//            修改自己信息  self为1
            if(request.getParameter("self") != null){
                //创建session对象
                HttpSession session = request.getSession();
                //把用户数据保存在session域对象中
                session.setAttribute("user", managerDto);
            }

            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.MANAGER_UPDATE_FAIL.getValue());
            result.setMessage(Code.MANAGER_UPDATE_FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/selectManagerByPage")
    @ResponseBody
    public ResResult selectManagerByPage(PageDto pageDto, ManagerDto managerDto){
        ResResult result = new ResResult();
        try {
            if(managerService.selectManagerByPage(pageDto,managerDto)){
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
        return result;
    }

    @RequestMapping("/selectManagerById")
    @ResponseBody
    public ResResult selectManagerById (ManagerDto ManagerDto){
        ResResult result = new ResResult();
        try {
            result.setData(managerService.selectManagerById(ManagerDto));
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return  result;
    }
}
