package com.yiding.common;

import com.yiding.action.websocket.WebSocketServer;
import com.yiding.dao.CustomMapper;
import com.yiding.dao.ManagerMapper;
import com.yiding.dto.CustomDto;
import com.yiding.dto.ManagerDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
@Scope("singleton")
public class AppContext {

    private final Logger logger = LoggerFactory.getLogger(AppContext.class);

    @Autowired
    private WebSocketServer webSocketServer;
//    @Autowired
//    private ManagerMapper managerMapper;
//    @Autowired
//    private CustomMapper customMapper;
    
    private Thread nettyThread;
    
    /**
     * 描述：Tomcat加载完ApplicationContext-main和netty文件后：
     *      1. 启动Netty WebSocket服务器；
     *      2. 加载用户数据；
     *      3. 加载用户交流群数据。
     */
    @PostConstruct
    public void init() {
        nettyThread = new Thread(webSocketServer);
        logger.info("开启独立线程，启动Netty WebSocket服务器...");
        nettyThread.start();
//        logger.info("加载用户数据...");
//        managerMapper.loadUserInfo();
//        logger.info("加载用户交流群数据...");
//        customMapper.loadGroupInfo();
    }

    /**
     * 描述：Tomcat服务器关闭前需要手动关闭Netty Websocket相关资源，否则会造成内存泄漏。
     *      1. 释放Netty Websocket相关连接；
     *      2. 关闭Netty Websocket服务器线程。（强行关闭，是否有必要？）
     */
    @SuppressWarnings("deprecation")
    @PreDestroy
    public void close() {
        logger.info("正在释放Netty Websocket相关连接...");
        webSocketServer.close();
        logger.info("正在关闭Netty Websocket服务器线程...");
        nettyThread.stop();
        logger.info("系统成功关闭！");
    }
}
