package com.yiding.pojo;

import java.util.Date;

public class Visitor {
    private Long visitorId;

    private String visitorName;

    private String visitorPhone;

    private String visitorIp;

    private String visitorSourse;

    private String visitorKeyword;

    private String visitorProvince;

    private String visitorCity;

    private String visitorPlat;

    private String visitorSystem;

    private String visitorRemark;

    private String visitorSearch;

    private Byte visitorDisplay;

    private String visitorPassword;

    private Long managerId;

    private Date visitorCreateTime;

    private Date visitorLastTime;

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName == null ? null : visitorName.trim();
    }

    public String getVisitorPhone() {
        return visitorPhone;
    }

    public void setVisitorPhone(String visitorPhone) {
        this.visitorPhone = visitorPhone == null ? null : visitorPhone.trim();
    }

    public String getVisitorIp() {
        return visitorIp;
    }

    public void setVisitorIp(String visitorIp) {
        this.visitorIp = visitorIp == null ? null : visitorIp.trim();
    }

    public String getVisitorSourse() {
        return visitorSourse;
    }

    public void setVisitorSourse(String visitorSourse) {
        this.visitorSourse = visitorSourse == null ? null : visitorSourse.trim();
    }

    public String getVisitorKeyword() {
        return visitorKeyword;
    }

    public void setVisitorKeyword(String visitorKeyword) {
        this.visitorKeyword = visitorKeyword == null ? null : visitorKeyword.trim();
    }

    public String getVisitorProvince() {
        return visitorProvince;
    }

    public void setVisitorProvince(String visitorProvince) {
        this.visitorProvince = visitorProvince == null ? null : visitorProvince.trim();
    }

    public String getVisitorCity() {
        return visitorCity;
    }

    public void setVisitorCity(String visitorCity) {
        this.visitorCity = visitorCity == null ? null : visitorCity.trim();
    }

    public String getVisitorPlat() {
        return visitorPlat;
    }

    public void setVisitorPlat(String visitorPlat) {
        this.visitorPlat = visitorPlat == null ? null : visitorPlat.trim();
    }

    public String getVisitorSystem() {
        return visitorSystem;
    }

    public void setVisitorSystem(String visitorSystem) {
        this.visitorSystem = visitorSystem == null ? null : visitorSystem.trim();
    }

    public String getVisitorRemark() {
        return visitorRemark;
    }

    public void setVisitorRemark(String visitorRemark) {
        this.visitorRemark = visitorRemark == null ? null : visitorRemark.trim();
    }

    public String getVisitorSearch() {
        return visitorSearch;
    }

    public void setVisitorSearch(String visitorSearch) {
        this.visitorSearch = visitorSearch == null ? null : visitorSearch.trim();
    }

    public Byte getVisitorDisplay() {
        return visitorDisplay;
    }

    public void setVisitorDisplay(Byte visitorDisplay) {
        this.visitorDisplay = visitorDisplay;
    }

    public String getVisitorPassword() {
        return visitorPassword;
    }

    public void setVisitorPassword(String visitorPassword) {
        this.visitorPassword = visitorPassword == null ? null : visitorPassword.trim();
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Date getVisitorCreateTime() {
        return visitorCreateTime;
    }

    public void setVisitorCreateTime(Date visitorCreateTime) {
        this.visitorCreateTime = visitorCreateTime;
    }

    public Date getVisitorLastTime() {
        return visitorLastTime;
    }

    public void setVisitorLastTime(Date visitorLastTime) {
        this.visitorLastTime = visitorLastTime;
    }
}