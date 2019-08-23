package com.yiding.common;


import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
/**日期工具类*/
public class DateUtills {

    private static SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd");
    private static SimpleDateFormat datetimeformat = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm:ss");
    private static SimpleDateFormat calendarformat = new SimpleDateFormat(
            "yyyy年MM月dd日");
    /**
     * 日期转换成字符串 格式为yyyy-MM-dd
     * @param date 日期
     * @return String
     */
    public static String dateToString(Date date)throws Exception{
        String strDate=null;
        if(date!=null){
            strDate=dateformat.format(date);
        }
        return strDate;
    }
    /**
     * 日期转换成字符串 格式为yyyy-MM-dd hh:mm:ss
     * @param date 日期
     * @return String
     */
    public static String dateToTimeString(Date date)throws Exception{
        String strDate=null;

        if(date!=null){
            strDate=datetimeformat.format(date);
        }
        return strDate;
    }
    /**
     * 日期转换成字符串 格式为yyyy年MM月dd日
     * @param date 日期
     * @return String
     */
    public static String dateToCalendarStr(Date date)throws Exception{
        String strDate=null;
        if(date!=null){
            strDate=calendarformat.format(date);
        }
        return strDate;
    }
    /**
     * 日期转换成字符串 格式自定义
     * @param date 日期
     * @param string 日期格式
     * @return String
     */
    public static String dateToStr(Date date,String string)throws Exception{
        String strDate=null;
        if(date!=null){
            SimpleDateFormat format = new SimpleDateFormat(string);
            strDate=format.format(date);
        }
        return strDate;
    }
    /**
     * 格式为yyyy-MM-dd 的字符串转换成日期格式
     * @param str 日期字符串
     * @return Date
     */
    public static Date stringToDate(String str)throws Exception{
        Date date=null;
        if(str!=null){
            date =dateformat.parse(str);
        }
        return date;
    }
    /**
     * 格式为yyyy-MM-dd hh:mm:ss 的字符串转换成日期格式
     * @param str 日期字符串
     * @return Date
     */
    public static Date stringToTimeDate(String str)throws Exception{
        Date date=null;
        if(str!=null){
            date =datetimeformat.parse(str);
        }
        return date;
    }
    /**
     * 格式为yyyy年MM月dd日 的字符串转换成日期格式
     * @param str 日期字符串
     * @return Date
     */
    public static Date stringToCalendarDate(String str)throws Exception{
        Date date=null;
        if(str!=null){
            date =calendarformat.parse(str);
        }
        return date;
    }
    /**
     * 自定义格式 的字符串转换成日期格式
     * @param str 日期字符串
     * @param string 自定义格式
     * @return Date
     */
    public static Date strTodate(String str,String string)throws Exception{
        Date date=null;
        if(str!=null){
            SimpleDateFormat format = new SimpleDateFormat(string);
            date =format.parse(str);
        }
        return date;
    }
    /**
     * 得到n天之后的日期
     * @param days
     * @return
     */
    public static String getAfterDayDate(int days) {

        Calendar canlendar = Calendar.getInstance(); // java.util包
        canlendar.add(Calendar.DATE, days); // 日期减 如果不够减会将月变动
        Date date = canlendar.getTime();

        SimpleDateFormat sdfd = new SimpleDateFormat("yyyy/MM/dd");
        String dateStr = sdfd.format(date);

        return dateStr;
    }

    /**
     * 通过时间秒毫秒数判断两个时间的间隔
     * @param date1
     * @param date2
     * @return
     */
    public static int differentDaysByMillisecond(Date date1,Date date2)
    {
        int days = (int) ((date2.getTime() - date1.getTime()) / (1000*3600*24));
        return days;
    }

}
