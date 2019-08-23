package com.yiding.dao;

import com.yiding.pojo.Manager;

import java.util.List;
import java.util.Map;

public interface ManagerMapper {
    int deleteByPrimaryKey(Long managerId);

    int insert(Manager record);

    int insertSelective(Manager record);

    Manager selectByPrimaryKey(Long managerId);

    int updateByPrimaryKeySelective(Manager record);

    int updateByPrimaryKey(Manager record);

    List<Manager> selectByPage(Map<String, Object> param);

    int getTotal(Map<String, Object> param);

    Manager login(Manager pojo);

    List<Manager> selectAllAdviserByVisitorID(Long visitorId);
}