package com.yiding.dao;

import com.yiding.pojo.Deal;

import java.util.List;
import java.util.Map;

public interface DealMapper {
    int deleteByPrimaryKey(Long dealId);

    int insert(Deal record);

    int insertSelective(Deal record);

    Deal selectByPrimaryKey(Long dealId);

    int updateByPrimaryKeySelective(Deal record);

    int updateByPrimaryKey(Deal record);

    int getTotal(Map<String, Object> param);

    int getDealCustomTotal(Map<String, Object> param);

    List<Deal> selectByPage(Map<String, Object> param);
}