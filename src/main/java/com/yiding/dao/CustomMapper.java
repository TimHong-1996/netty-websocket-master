package com.yiding.dao;

import com.yiding.pojo.Custom;

import java.util.List;
import java.util.Map;

public interface CustomMapper {
    int deleteByPrimaryKey(Long customId);

    int insert(Custom record);

    int insertSelective(Custom record);

    Custom selectByPrimaryKey(Long customId);

    int updateByPrimaryKeySelective(Custom record);

    int updateByPrimaryKey(Custom record);

    List<Custom> selectByPage(Map map);

    int getTotal(Map<String, Object> param);

    List<Custom> selectAllUpdate();
}