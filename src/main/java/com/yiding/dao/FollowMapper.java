package com.yiding.dao;

import com.yiding.pojo.Follow;

import java.util.List;
import java.util.Map;

public interface FollowMapper {
    int deleteByPrimaryKey(Long followId);

    int insert(Follow record);

    int insertSelective(Follow record);

    Follow selectByPrimaryKey(Long followId);

    int updateByPrimaryKeySelective(Follow record);

    int updateByPrimaryKey(Follow record);

    int getTotal(Map<String, Object> param);

    List<Follow> selectByPage(Map<String, Object> param);
}