package com.fanfou.controller;

import com.fanfou.crawler.Crawler;
import com.fanfou.crawler.CrawlerUserlineThread;
import com.fanfou.pojo.TestPojo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Objects;

@Controller
public class TestController {

    @RequestMapping(value = "/test")
    @ResponseBody
    public String test(HttpServletRequest request) throws InterruptedException {
        System.out.println("访问后台");
        Thread thread = new Thread(new CrawlerUserlineThread(request.getParameter("para1")));
        thread.start();
        Thread userFriendThread = new Thread(new Crawler(request.getParameter("para1")));
        userFriendThread.start();
        thread.join();
        userFriendThread.join();
        String a = request.getParameter("para1");
        System.out.println(a);
        return "eee";

//        TestPojo testPojo = new TestPojo();
//        testPojo.setUsername(name);
//        testPojo.setPassword("123");
//        System.out.println("好起来了");
//        System.out.println(name + test);
//        return testPojo.toString() + test;
    }
}
