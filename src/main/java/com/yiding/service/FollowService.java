package com.yiding.service;

import com.yiding.dto.FollowDto;
import com.yiding.dto.ManagerDto;
import com.yiding.dto.PageDto;

public interface FollowService {
    void updateFollow(FollowDto followDto) throws Exception;

    void insertFollow(FollowDto followDto) throws Exception;

    boolean selectFollowByPage(PageDto pageDto, FollowDto followDto, ManagerDto mDto) throws Exception;
}
