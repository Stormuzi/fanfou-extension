package com.fanfou.controller;

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
    public String test(@RequestParam Map<String,Object> data, HttpServletRequest request)
    {
          if(data.size()!=0){
                for(Map.Entry<String,Object> entry: data.entrySet()){
                    System.out.println("Key = "+ entry.getKey()+"value = "+ entry.getValue());
                }
                return "成了";
          }else {
          }
          return "败了";

//        TestPojo testPojo = new TestPojo();
//        testPojo.setUsername(name);
//        testPojo.setPassword("123");
//        System.out.println("好起来了");
//        System.out.println(name + test);
//        return testPojo.toString() + test;
    }
}
