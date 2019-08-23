package com.yiding.pojo;

import java.util.Date;

public class Deal {
    private Long dealId;

    private Long managerId;

    private Long customId;

    private String dealBuild;

    private Float dealArea;

    private Byte dealDisplay;

    private Integer dealCommission;

    private String dealNum;

    private Date dealDate;

    private String unname1;

    private String unname2;

    public Long getDealId() {
        return dealId;
    }

    public void setDealId(Long dealId) {
        this.dealId = dealId;
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

    public String getDealBuild() {
        return dealBuild;
    }

    public void setDealBuild(String dealBuild) {
        this.dealBuild = dealBuild == null ? null : dealBuild.trim();
    }

    public Float getDealArea() {
        return dealArea;
    }

    public void setDealArea(Float dealArea) {
        this.dealArea = dealArea;
    }

    public Byte getDealDisplay() {
        return dealDisplay;
    }

    public void setDealDisplay(Byte dealDisplay) {
        this.dealDisplay = dealDisplay;
    }

    public Integer getDealCommission() {
        return dealCommission;
    }

    public void setDealCommission(Integer dealCommission) {
        this.dealCommission = dealCommission;
    }

    public String getDealNum() {
        return dealNum;
    }

    public void setDealNum(String dealNum) {
        this.dealNum = dealNum == null ? null : dealNum.trim();
    }

    public Date getDealDate() {
        return dealDate;
    }

    public void setDealDate(Date dealDate) {
        this.dealDate = dealDate;
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