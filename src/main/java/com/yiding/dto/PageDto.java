package com.yiding.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
/**
 * 分页查询使用
 * E 为相应的查询对象*/
public class PageDto<E> implements Serializable {
    private static final Long serialVersionUID = 1L;

    private int size=10;//每页显示条数
    private int page=1;//当前页数
    private int amount;//总条数
    private int maxPage;//最大页数
    private List<E> list=new ArrayList<>();//查询结果

    public PageDto(int a){
        this.size=a;
    }
    public PageDto(){}
    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size ;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
        setMaxPage();
    }

    public int getMaxPage() {
        return maxPage;
    }

    private void setMaxPage() {
        this.maxPage = this.amount%this.size==0?this.amount/this.size:this.amount/this.size+1;
    }

    public List<E> getList() {
        return list;
    }

    public void setList(List<E> list) {
        this.list = list;
    }
}
