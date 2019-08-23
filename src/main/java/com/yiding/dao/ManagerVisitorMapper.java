package com.yiding.dao;

import com.yiding.pojo.ManagerVisitor;

public interface ManagerVisitorMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ManagerVisitor record);

    int insertSelective(ManagerVisitor record);

    ManagerVisitor selectByPrimaryKey(Long id);

    ManagerVisitor selectByManagerAndVisitor(ManagerVisitor record);

    int updateByPrimaryKeySelective(ManagerVisitor record);

    int updateByPrimaryKey(ManagerVisitor record);
}