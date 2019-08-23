package com.yiding.service;

import com.yiding.dto.LogDto;
import com.yiding.dto.PageDto;

public interface LogService {
    void insertLog(LogDto logDto) throws Exception;

    void selectLogByIdAndPage(LogDto logDto, PageDto pageDto) throws Exception;
}
