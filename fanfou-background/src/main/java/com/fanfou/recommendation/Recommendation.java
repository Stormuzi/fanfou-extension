package com.fanfou.recommendation;

import com.fanfou.crawler.CrawlerUtil;
import com.fanfou.db.JdbcUtil;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.UnsupportedEncodingException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Recommendation {

    public static void main(String[] args) throws IOException, SQLException, InterruptedException {
        String id = "~Z-lo_exzyRQ";
        List<String> recommendation_items = new ArrayList<>();
        recommendation_items.add("~2nznA4y3aok");
        recommendation_items.add("~4YrlavbYJuc");
        recommendation_items.add("~5m20Q1fSwQ4");
        recommendation_items.add("~EEUxl7dm_IY");
        Recommendation er=new Recommendation();
//        String re =er.userTimeLineRecommend("10","0.5");
        String re=er.userRecommend("5","URA3");
        //System.out.println(re);
    }

    //调用python代码进行用户推荐计算
    public String userRecommend(String top_k,String selectURA) throws IOException, InterruptedException, SQLException {
        System.out.println("进入userRecommend");
        String url = "E:\\Study\\毕设\\git-fanfou\\pythonCode\\user.py";
        String[]  args1 = new String[]{"python",url,top_k,selectURA};
        LineNumberReader in = getLineNumberReader(args1);
        String line=null;
        List<String> recommendation_users = new ArrayList<>();
        //运算结果存入recommendation_items
        while((line =in.readLine()) != null){

                recommendation_users.add(line.trim());
        }
        in.close();
        return getUserDetail(recommendation_users);

    }
    //获取具体推荐内容细节
    public String getUserDetail(List<String> recommendation_users) throws SQLException {
        System.out.println("getUserDetail");
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        StringBuilder sb = new StringBuilder();
        for(String user : recommendation_users){
            System.out.println(user);
            String sql = "select * from fanfou_schema.user_friend_info where friend_id ='" + user + "'";
            Statement pst =  conn.createStatement();
            ResultSet rs = pst.executeQuery(sql);
            if(rs.next()){
                sb.append(rs.getString("friend_name")).append("&").append(CrawlerUtil.USER_HOME_PAGE).append(rs.getString("friend_id")).append("|");
            }
        }
        conn.close();
        System.out.println(sb);
        return  sb.toString();

    }

    public LineNumberReader getLineNumberReader(String[]  args1) throws IOException, InterruptedException {
        Process process = Runtime.getRuntime().exec(args1);
        LineNumberReader in = new LineNumberReader(new InputStreamReader(process.getInputStream(),"GBK"));
        process.waitFor();
        return in;
    }

    //调用python代码进行消息推荐计算
    public String userTimeLineRecommend(String need_top_k,String alpha) throws IOException, InterruptedException, SQLException {
        System.out.println("进入userTimeLineRecommend");
        String url = "E:\\Study\\毕设\\git-fanfou\\pythonCode\\usertimeline.py";
        String[]  args1 = new String[]{"python",url,need_top_k,alpha};
        LineNumberReader in =  getLineNumberReader(args1);
        String line=null;
        int i = 0;
        List<String> recommendation_items = new ArrayList<>();
        //运算结果存入recommendation_items
        while((line =in.readLine()) != null){
//            System.out.println(line);
            if(i>6){
                recommendation_items.add(line.trim());
            }
            i++;
        }
        in.close();
        System.out.println(recommendation_items);
        return getItemDetail(recommendation_items);
    }
    //获取具体推荐内容细节
    public String getItemDetail(List<String> recommendation_items) throws SQLException {
        System.out.println("进入getItemDetail");
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        StringBuilder sb = new StringBuilder();
        for(String item_it : recommendation_items){
            String sql = "select * from fanfou_schema.user_timeline_not_null where id ='" + item_it + "'";
            Statement pst =  conn.createStatement();
            ResultSet rs = pst.executeQuery(sql);
            rs.next();
            sb.append(rs.getString("text")).append("&").append(CrawlerUtil.SIGINAL_TIMELINE_URL).append(rs.getString("id")).append("|");
        }
        conn.close();
        System.out.println(sb);
        return  sb.toString();
    }

}
