package com.yiding.dto;

import com.alibaba.fastjson.JSONObject;

import java.io.Serializable;
import java.util.Map;

public class ResResult implements Serializable{
    private static final Long serialVersionUID = 1L;
    private int code;
    private String message;
    private Map<String, ManagerDto> adviserInfoMap;
    private Map<String, VisitorDto> visitorInfoMap;
    private VisitorDto visitorDto;
    private ManagerDto managerDto;
    private Map<Object,Object> historyMap;
    private Object data;
    private String type;

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, ManagerDto> getAdviserInfoMap() {
        return adviserInfoMap;
    }

    public void setAdviserInfoMap(Map<String, ManagerDto> adviserInfoMap) {
        this.adviserInfoMap = adviserInfoMap;
    }


    public Map<String, VisitorDto> getVisitorInfoMap() {
        return visitorInfoMap;
    }

    public void setVisitorInfoMap(Map<String, VisitorDto> visitorInfoMap) {
        this.visitorInfoMap = visitorInfoMap;
    }

    public Map<Object, Object> getHistoryMap() {
        return historyMap;
    }

    public void setHistoryMap(Map<Object, Object> historyMap) {
        this.historyMap = historyMap;
    }

    public ResResult(){}
    public ResResult(int code, String message, Object data){
        this.code=code;
        this.message=message;
        this.data=data;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Object getData() {
        return data;
    }

    @Override
    public String toString() {
        return JSONObject.toJSONString(this);
    }
}
