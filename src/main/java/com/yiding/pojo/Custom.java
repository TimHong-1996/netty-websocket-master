package com.yiding.pojo;

import java.util.Date;

public class Custom {
    private Long customId;

    private String customName;

    private Byte customSex;

    private String customProvince;

    private String customCity;

    private String customPhone;

    private String customSource;

    private String customNeed;

    private Date customCreatTime;

    private String customRemark;

    private Date customUpdateTime;

    private Byte customDeal;

    private Byte customState;

    private Byte customDisplay;

    private Long managerId;

    private String unname1;

    private String unname2;

    public Long getCustomId() {
        return customId;
    }

    public void setCustomId(Long customId) {
        this.customId = customId;
    }

    public String getCustomName() {
        return customName;
    }

    public void setCustomName(String customName) {
        this.customName = customName == null ? null : customName.trim();
    }

    public Byte getCustomSex() {
        return customSex;
    }

    public void setCustomSex(Byte customSex) {
        this.customSex = customSex;
    }

    public String getCustomProvince() {
        return customProvince;
    }

    public void setCustomProvince(String customProvince) {
        this.customProvince = customProvince == null ? null : customProvince.trim();
    }

    public String getCustomCity() {
        return customCity;
    }

    public void setCustomCity(String customCity) {
        this.customCity = customCity == null ? null : customCity.trim();
    }

    public String getCustomPhone() {
        return customPhone;
    }

    public void setCustomPhone(String customPhone) {
        this.customPhone = customPhone == null ? null : customPhone.trim();
    }

    public String getCustomSource() {
        return customSource;
    }

    public void setCustomSource(String customSource) {
        this.customSource = customSource == null ? null : customSource.trim();
    }

    public String getCustomNeed() {
        return customNeed;
    }

    public void setCustomNeed(String customNeed) {
        this.customNeed = customNeed == null ? null : customNeed.trim();
    }

    public Date getCustomCreatTime() {
        return customCreatTime;
    }

    public void setCustomCreatTime(Date customCreatTime) {
        this.customCreatTime = customCreatTime;
    }

    public String getCustomRemark() {
        return customRemark;
    }

    public void setCustomRemark(String customRemark) {
        this.customRemark = customRemark == null ? null : customRemark.trim();
    }

    public Date getCustomUpdateTime() {
        return customUpdateTime;
    }

    public void setCustomUpdateTime(Date customUpdateTime) {
        this.customUpdateTime = customUpdateTime;
    }

    public Byte getCustomDeal() {
        return customDeal;
    }

    public void setCustomDeal(Byte customDeal) {
        this.customDeal = customDeal;
    }

    public Byte getCustomState() {
        return customState;
    }

    public void setCustomState(Byte customState) {
        this.customState = customState;
    }

    public Byte getCustomDisplay() {
        return customDisplay;
    }

    public void setCustomDisplay(Byte customDisplay) {
        this.customDisplay = customDisplay;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
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