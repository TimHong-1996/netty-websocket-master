package com.yiding.service;

import com.yiding.dto.DealDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;

public interface DealService {
    DealDto selectDealById(DealDto dealDto) throws Exception;

    boolean selectDealByPage(PageDto pageDto, DealDto dealDto, ManagerDto mDto, Byte sort) throws Exception;

    void updateDeal(DealDto dealDto) throws Exception;

    void insertDeal(DealDto dealDto, ManagerDto mDto) throws Exception;
}
