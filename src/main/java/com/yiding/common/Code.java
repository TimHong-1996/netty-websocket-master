package com.yiding.common;

public enum Code {
    SUCCESS(2000,"成功"),
    FAIL(3000,"失败"),
    NO_RESULT(3001,"查无结果"),
    LOGIN_OUTTIME(3002,"登录超时"),
    CUSTOM_INSERT_FAIL(3010,"客户添加失败"),
    CUSTOM_UPDATE_FAIL(3011,"客户修改失败"),
    MANAGER_INSERT_FAIL(3020,"账号生成失败"),
    MANAGER_UPDATE_FAIL(3021,"账户修改失败"),
    MANAGER_RESET_PWD_FAIL(3022,"账户重置密码失败"),
    DEAL_INSERT_FAIL(3030,"成交记录添加失败"),
    DEAL_UPDATE_FAIL(3031,"成交记录修改失败"),
    FOLLOW_INSERT_FAIL(3040,"跟进记录添加失败"),
    FOLLOW_UPDATE_FAIL(3041,"跟进记录修改失败"),;




    int value;
    String name;
    Code(int value, String name){
        this.value = value;
        this.name = name;
    }
    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }
}
