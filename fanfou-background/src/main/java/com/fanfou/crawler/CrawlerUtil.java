package com.fanfou.crawler;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class CrawlerUtil {
    public static final String FRIENDS_URL = "http://api.fanfou.com/users/friends.json?id=";
    public static final String USER_INFO_URL = "http://api.fanfou.com/users/show.json?id=";
    public static final String USER_TIMELINE_URL = "http://api.fanfou.com/statuses/user_timeline.json?id=";

    private static String CrawlerGetString(String url) throws MalformedURLException {
        InputStreamReader reader = null;
        BufferedReader in = null;
        if(url==null) return null;
        URL httpUrl = new URL(url);
        try {
            URLConnection connection =(HttpURLConnection) httpUrl.openConnection();
            connection.setConnectTimeout(1000);
            if(((HttpURLConnection) connection).getResponseCode() != HttpURLConnection.HTTP_OK){
                return null;
            }
            reader = new InputStreamReader(connection.getInputStream(), "UTF-8");
            in = new BufferedReader(reader);
            String line = null;//每行内容
            StringBuffer content = new StringBuffer();
            while ((line = in.readLine()) != null) {
                content.append(line);
            }
            if (content.length() != 0) {
                String jsonStr = content.toString();
                return jsonStr;
            }
        } catch (UnsupportedEncodingException e1) {
            e1.printStackTrace();
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        return null;
    }
    /**
     * 根据url获取JSONArray
     * @param url
     * @return
     * @throws MalformedURLException
     */
    public static JSONArray CrawlerArray(String url) throws MalformedURLException
    {
            if(url == null) return null;
            String jsonStr = CrawlerGetString(url);
            if(jsonStr==null) return null;
            JSONArray jsonArray = JSON.parseArray(jsonStr);
            return jsonArray;

    }
    /**
     * 根据url获取JSONObject
     * @param url
     * @return
     * @throws MalformedURLException
     */
    public static JSONObject CrawlerObject(String url) throws MalformedURLException
    {
        String jsonStr = CrawlerGetString(url);
        if(jsonStr==null) return null;
        JSONObject jsonObject = JSON.parseObject(jsonStr);
        return jsonObject;

    }



}
