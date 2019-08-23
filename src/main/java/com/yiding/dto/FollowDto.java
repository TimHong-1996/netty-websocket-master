package com.yiding.dto;

import java.io.Serializable;

public class FollowDto implements Serializable {
    private static final Long serialVersionUID = 1L;
    private Long followId;

    private Long managerId;

    private Long customId;

    private String followContent;

    private String followDate;

    private Byte followDisplay;

    private String unname1;

    private String unname2;

    private CustomDto customDto;

    private ManagerDto managerDto;

    //    能否对该条记录进行操作
    private Byte canOperate = 1;

    public Byte getCanOperate() {
        return canOperate;
    }

    public void setCanOperate(Byte canOperate) {
        this.canOperate = canOperate;
    }

    public CustomDto getCustomDto() {
        return customDto;
    }

    public void setCustomDto(CustomDto customDto) {
        this.customDto = customDto;
    }

    public ManagerDto getManagerDto() {
        return managerDto;
    }

    public void setManagerDto(ManagerDto managerDto) {
        this.managerDto = managerDto;
    }

    public Long getFollowId() {
        return followId;
    }

    public void setFollowId(Long followId) {
        this.followId = followId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Long getCustomId() {
        return customId;
    }

    public void setCustomId(Long customId) {
        this.customId = customId;
    }

    public String getFollowContent() {
        return followContent;
    }

    public void setFollowContent(String followContent) {
        this.followContent = followContent == null ? null : followContent.trim();
    }

    public String getFollowDate() {
        return followDate;
    }

    public void setFollowDate(String followDate) {
        this.followDate = followDate;
    }

    public Byte getFollowDisplay() {
        return followDisplay;
    }

    public void setFollowDisplay(Byte followDisplay) {
        this.followDisplay = followDisplay;
    }

    public String getUnname1() {
        return unname1;
    }

    public void setUnname1(String unname1) {
        this.unname1 = unname1 == null ? null : unname1.trim();
    }

    public String getUnname2() {
        return unname2;
    }

    public void setUnname2(String unname2) {
        this.unname2 = unname2 == null ? null : unname2.trim();
    }
}
