package com.yiding.dto;

import java.io.Serializable;
import java.util.List;

public class LogListDto implements Serializable {
    private static final Long serialVersionUID = 1L;

    private PageDto pageDto;

    private ManagerDto managerDto;

    private VisitorDto visitorDto;

    public PageDto getPageDto() {
        return pageDto;
    }

    public void setPageDto(PageDto pageDto) {
        this.pageDto = pageDto;
    }

    public ManagerDto getManagerDto() {
        return managerDto;
    }

    public void setManagerDto(ManagerDto managerDto) {
        this.managerDto = managerDto;
    }

    public VisitorDto getVisitorDto() {
        return visitorDto;
    }

    public void setVisitorDto(VisitorDto visitorDto) {
        this.visitorDto = visitorDto;
    }
}
