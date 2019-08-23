package com.yiding.action.backstageaction;

import com.yiding.common.Code;
import com.yiding.dto.DealDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;
import com.yiding.dto.ResResult;
import com.yiding.service.DealService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/backstage")
public class DealAction {

    @Resource
    DealService dealService;

    @RequestMapping("/insertDeal")
    @ResponseBody
    public ResResult insertDeal(HttpServletRequest request, DealDto dealDto){
        ResResult result = new ResResult();
        try{
            //创建session对象
            HttpSession session = request.getSession();
            //取出在session域对象中
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            dealDto.setManagerId(mDto.getManagerId());
            dealService.insertDeal(dealDto,mDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.DEAL_INSERT_FAIL.getValue());
            result.setMessage(Code.DEAL_INSERT_FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/updateDeal")
    @ResponseBody
    public ResResult updateDeal(HttpServletRequest request,DealDto dealDto){
        ResResult result = new ResResult();
        try{
            dealService.updateDeal(dealDto);
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.DEAL_UPDATE_FAIL.getValue());
            result.setMessage(Code.DEAL_UPDATE_FAIL.getName());
        }
        return result;
    }

    @RequestMapping("/selectDealByPage")
    @ResponseBody
    public ResResult selectDealByPage(HttpServletRequest request,PageDto pageDto, DealDto dealDto){
        ResResult result = new ResResult();
        try {
            //创建session对象
            HttpSession session = request.getSession();
            //取出在session域对象中
            ManagerDto mDto = (ManagerDto) session.getAttribute("user");
            Byte sort = Byte.valueOf("0");;
            if(request.getParameter("sort") != null && !request.getParameter("sort").equals("0")){
                sort = Byte.valueOf(request.getParameter("sort"));
            }
            if(dealService.selectDealByPage(pageDto,dealDto,mDto,sort)){
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

    @RequestMapping("/selectDealById")
    @ResponseBody
    public ResResult selectDealById (DealDto dealDto){
        ResResult result = new ResResult();
        try {
            result.setData(dealService.selectDealById(dealDto));
            result.setCode(Code.SUCCESS.getValue());
            result.setMessage(Code.SUCCESS.getName());
        }catch (Exception e){
            result.setCode(Code.FAIL.getValue());
            result.setMessage(Code.FAIL.getName());
        }
        return  result;
    }
}
