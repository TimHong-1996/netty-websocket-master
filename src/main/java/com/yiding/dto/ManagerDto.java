package com.yiding.dto;

import com.alibaba.fastjson.JSONObject;
import com.yiding.common.Constant;

import java.io.Serializable;
import java.util.Map;

public class ManagerDto implements Serializable {
    private static final Long serialVersionUID = 1L;
    private Long managerId;

    private String managerName;

    private String managerPassword;

    private Byte managerPower;

    private String managerCreateTime;

    private String managerPhone;

    private Byte managerDisplay;

    private String unname1;

    private String unname2;

    private int customTotalNum;

    private int customDealNum;

    private int DealNum;

    private Map<String,VisitorDto> visitorDtoMap;

    public Map<String, VisitorDto> getVisitorDtoMap() {
        return visitorDtoMap;
    }

    public void setVisitorDtoMap(Map<String, VisitorDto> visitorDtoMap) {
        this.visitorDtoMap = visitorDtoMap;
    }

    public int getCustomTotalNum() {
        return customTotalNum;
    }

    public void setCustomTotalNum(int customTotalNum) {
        this.customTotalNum = customTotalNum;
    }

    public int getCustomDealNum() {
        return customDealNum;
    }

    public void setCustomDealNum(int customDealNum) {
        this.customDealNum = customDealNum;
    }

    public int getDealNum() {
        return DealNum;
    }

    public void setDealNum(int dealNum) {
        DealNum = dealNum;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName == null ? null : managerName.trim();
    }

    public String getManagerPassword() {
        return managerPassword;
    }

    public void setManagerPassword(String managerPassword) {
        this.managerPassword = managerPassword == null ? null : managerPassword.trim();
    }

    public Byte getManagerPower() {
        return managerPower;
    }

    public void setManagerPower(Byte managerPower) {
        this.managerPower = managerPower;
    }

    public String getManagerCreateTime() {
        return managerCreateTime;
    }

    public void setManagerCreateTime(String managerCreateTime) {
        this.managerCreateTime = managerCreateTime;
    }

    public String getManagerPhone() {
        return managerPhone;
    }

    public void setManagerPhone(String managerPhone) {
        this.managerPhone = managerPhone == null ? null : managerPhone.trim();
    }

    public Byte getManagerDisplay() {
        return managerDisplay;
    }

    public void setManagerDisplay(Byte managerDisplay) {
        this.managerDisplay = managerDisplay;
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

    @Override
    public String toString() {
        return JSONObject.toJSONString(this);
    }
}
