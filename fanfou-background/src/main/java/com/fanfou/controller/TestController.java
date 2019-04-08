package com.fanfou.controller;

import com.fanfou.check.RequestCheckUtil;
import com.fanfou.crawler.Crawler;
import com.fanfou.crawler.CrawlerUserlineThread;

import com.fanfou.recommendation.Recommendation;
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
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
public class TestController {

    @RequestMapping(value = "/friendRe", produces = "text/html; charset=utf-8")
    @ResponseBody
    public String friendRe(HttpServletRequest request) throws InterruptedException, IOException, SQLException {
        if(!RequestCheckUtil.isFriendRequestLegal(request)){
            return "null";
        }
        System.out.println("访问用户后台:" + request.getParameter("user_id"));
//        Crawler crawler = new Crawler();
//        crawler.Crawler_Friends(request.getParameter("user_id"));
        Recommendation recommendation = new Recommendation();
        //推荐用户
        String result = recommendation.userRecommend(request.getParameter("URAtop_k"),request.getParameter("selectURA"));
        return result;
//        return null;
    }

    @RequestMapping(value = "/UserTimeLine",  produces = "text/html; charset=utf-8")
    @ResponseBody
    public String userTimeLine(HttpServletRequest request) throws IOException, SQLException, InterruptedException {
        System.out.println("访问消息后台:" + request.getParameter("user_id"));
        if(!RequestCheckUtil.isUserTimeLineRequestLegal(request)){
            return "null";
        }
        long startTime =  System.currentTimeMillis();
        //爬取用户消息
//        CrawlerUserlineThread userline = new CrawlerUserlineThread();
//        userline.Crawler_User_TimeLine(request.getParameter("user_id"));
        //用户消息推荐
        Recommendation recommendation = new Recommendation();
        String result =
                recommendation.userTimeLineRecommend(request.getParameter("CRAtop_k"),request.getParameter("CRAalpha"));
        long endTime  =  System.currentTimeMillis();
        long usedTime = (endTime-startTime)/1000;
        System.out.println("use time:"+ usedTime + "s");
        return result;
        //return null;
    }

    @RequestMapping(value = "/progress", produces = "text/html;charset=utf-8")
    @ResponseBody
    public String getProgress() throws IOException {
        Jedis jedis = new Jedis();
        String logString = "";
        String temp = null;
        for (int i = 0; i < 1; i++) {
            temp = jedis.lpop("timeLineLog");
            if (temp != null && !StringUtil.isBlank(temp)) {
                logString += (temp + "\n");
            } else {
                break;
            }
        }
        return logString;
    }


}
