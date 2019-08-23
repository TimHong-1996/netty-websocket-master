package com.yiding.common;

public enum ChatType {

    REGISTER("REGISTER"),
    SINGLE_SENDING("SINGLE_SENDING"),
    GROUP_SENDING("GROUP_SENDING"),
    FILE_MSG_SINGLE_SENDING("FILE_MSG_SINGLE_SENDING"),
    FILE_MSG_GROUP_SENDING("FILE_MSG_GROUP_SENDING");

//    int value;
    String name;
    ChatType( String name){
//        this.value = value;
        this.name = name;
    }
//    public int getValue() {
//        return value;
//    }

    public String getName() {
        return name;
    }
}
