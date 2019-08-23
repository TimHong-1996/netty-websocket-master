package com.yiding.service.impl;

import com.yiding.dao.ManagerVisitorMapper;
import com.yiding.pojo.ManagerVisitor;
import com.yiding.service.ManagerVisitorService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("ManagerVisitorService")
public class ManagerVisitorServiceImpl implements ManagerVisitorService {

    @Resource
    ManagerVisitorMapper managerVisitorMapper;

    @Override
    public void insert(ManagerVisitor managerVisitor) throws Exception {
        if(managerVisitorMapper.selectByManagerAndVisitor(managerVisitor) == null){
            managerVisitorMapper.insert(managerVisitor);
        }

    }
}
