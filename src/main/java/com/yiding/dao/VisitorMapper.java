package com.yiding.dao;

import com.yiding.pojo.Visitor;

import java.util.List;
import java.util.Map;

public interface VisitorMapper {
    int deleteByPrimaryKey(Long visitorId);

    int insert(Visitor record);

    int insertSelective(Visitor record);

    Visitor selectByPrimaryKey(Long visitorId);

    Visitor selectByIP(String visitorIp);

    int updateByPrimaryKeySelective(Visitor record);

    int updateByPrimaryKey(Visitor record);


    List<Visitor> selectByPage(Map<String, Object> param);

    int getTotal(Map<String, Object> param);

    List<Visitor> selectAllByPage(Map<String, Object> param);

    int getAllTotal(Map<String, Object> param);
}