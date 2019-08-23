package com.yiding.dto;

import java.io.Serializable;

public class LogDto implements Serializable {
    private static final Long serialVersionUID = 1L;

    private Long logId;

    private Long visitorId;

    private Long managerId;

    private Byte logType;

    private String logContent;

    private String logDate;

    private Byte logSuccess;

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
    }

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public Byte getLogType() {
        return logType;
    }

    public void setLogType(Byte logType) {
        this.logType = logType;
    }

    public String getLogContent() {
        return logContent;
    }

    public void setLogContent(String logContent) {
        this.logContent = logContent == null ? null : logContent.trim();
    }

    public String getLogDate() {
        return logDate;
    }

    public void setLogDate(String logDate) {
        this.logDate = logDate;
    }

    public Byte getLogSuccess() {
        return logSuccess;
    }

    public void setLogSuccess(Byte logSuccess) {
        this.logSuccess = logSuccess;
    }
}
