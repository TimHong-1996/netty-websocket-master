package com.yiding.interceptor;

import com.yiding.dto.ManagerDto;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * 自定义判断是否登录拦截器
 * */
public class LoginInteceptor implements HandlerInterceptor {

    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // TODO Auto-generated method stub
        //在调用具体的action的方法之前执行
        //公共action不能拦截login
        //得到访问路径做判断，是否是公共action
        String uri = request.getRequestURI();
        if(uri.indexOf("login")>0){
            return true;//放行，执行登录
        }

        //判断是否登录
        ManagerDto user  = (ManagerDto) request.getSession().getAttribute("user");
        if(user!=null){
            return true;//放行，会去执行具体要访问的action
        }

        //默认是false 不放行，就需要跳转到登录页面
//        String path = request.getContextPath();
        request.getRequestDispatcher("/backstage/loginOverTime").forward(request, response);

        return false;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        // TODO Auto-generated method stub
        //已经访问了具体的action中的方法，在返回modelandview

    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // TODO Auto-generated method stub
        //访问action方法结束后执行

    }

}
