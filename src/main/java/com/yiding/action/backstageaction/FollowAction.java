package com.yiding.action.backstageaction;

import com.yiding.common.Code;
import com.yiding.dto.FollowDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.ResResult;
import com.yiding.service.FollowService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/backstage")
public class FollowAction {
    @Resource
    FollowService followService;

    @RequestMapping("/insertFollow")
    @ResponseBody
    public ResResult insertFollow(HttpServletRequest request,FollowDto followDto){
        ResResult result = new ResResult();
        try{
            //创建session对象
            HttpSession session = request.getSession();
            //取出在session域对象中
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            followDto.setManagerId(mDto.getManagerId());
            followService.insertFollow(followDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/updateFollow")
    @ResponseBody
    public ResResult updateFollow(HttpServletRequest request,FollowDto followDto){
        ResResult result = new ResResult();
        try{
            followService.updateFollow(followDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/selectFollowByPage")
    @ResponseBody
    public ResResult selectFollowByPage(HttpServletRequest request,PageDto pageDto , FollowDto followDto){
        ResResult result = new ResResult();
        try {
            //创建session对象
            HttpSession session = request.getSession();
            //取出在session域对象中
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            if(followService.selectFollowByPage(pageDto,followDto,mDto)){
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
}
