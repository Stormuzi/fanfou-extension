package com.fanfou.controller;

import com.fanfou.crawler.Crawler;
import com.fanfou.crawler.CrawlerUserlineThread;
import com.fanfou.pojo.TestPojo;

import org.jsoup.helper.StringUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import redis.clients.jedis.Jedis;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.MalformedURLException;
import java.sql.SQLException;
import java.util.Map;
import java.util.Objects;

@Controller
public class TestController {

    @RequestMapping(value = "/friendRe")
    @ResponseBody
    public String friendRe(HttpServletRequest request) throws InterruptedException, FileNotFoundException, SQLException, MalformedURLException {
        long startTime =  System.currentTimeMillis();
        System.out.println("访问后台");
        Crawler crawler = new Crawler();
        crawler.Crawler_Friends(request.getParameter("para1"));
        String a = request.getParameter("para1");
        long endTime  =  System.currentTimeMillis();
        long usedTime = (endTime-startTime)/1000;
        System.out.println(usedTime);
        return "eee";
    }
    @RequestMapping(value = "/UserTimeLine")
    @ResponseBody
    public String userTimeLine(HttpServletRequest request) throws FileNotFoundException, SQLException, MalformedURLException {
        long startTime =  System.currentTimeMillis();
        System.out.println("访问后台");
        CrawlerUserlineThread userline = new CrawlerUserlineThread();
        userline.Crawler_User_TimeLine(request.getParameter("para1"));
        long endTime  =  System.currentTimeMillis();
        long usedTime = (endTime-startTime)/1000;
        System.out.println(usedTime + "s");
        return "haole";
    }

    @RequestMapping(value = "/progress", produces = "text/html;charset=utf-8")
    @ResponseBody
    public String getProgress() throws IOException {
        Jedis jedis = new Jedis();
        String logString = "";
        String temp = null;
        for (int i = 0; i < 5; i++) {
            temp = jedis.lpop("timeLineLog");
            System.out.println("temp:" + temp);
            System.out.println(temp == null);
            if (temp != null && !StringUtil.isBlank(temp)) {
                logString += (temp + " \n");
            } else {
                break;
            }
        }
        System.out.println("logString:"+logString);
        return logString;
    }


}
