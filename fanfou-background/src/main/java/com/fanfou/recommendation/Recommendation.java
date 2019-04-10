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
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        String sql = "select * from fanfou_schema.user_friend_info where friend_id ='" + "准确性" + "'" + "and user_unique_id ='" + "隐私预算" +"'";
        Statement pst =  conn.createStatement();
        ResultSet rs = pst.executeQuery(sql);
        System.out.println(rs);
        if(rs.next()){
            System.out.println("有的");
        }else{
            System.out.println("无");
        }
//        String re =er.userTimeLineRecommend("10","0.5",id);
//        String re=er.userRecommend("5","URA3");
        //System.out.println(re);
    }

    //调用python代码进行用户推荐计算
    public String userRecommend(String top_k,String selectURA,String user_id, String isUserPrivate) throws IOException, InterruptedException, SQLException {
        System.out.println("进入userRecommend, 参数为：" + top_k + selectURA + user_id + isUserPrivate);
        String url = "E:\\Study\\毕设\\git-fanfou\\pythonCode\\user.py";
        String[]  args1 = new String[]{"python",url,top_k,selectURA,user_id,isUserPrivate};
        LineNumberReader in = getLineNumberReader(args1);
        String line=null;
        List<String> recommendation_users = new ArrayList<>();
        //运算结果存入recommendation_items
        while((line =in.readLine()) != null){
                recommendation_users.add(line.trim());
        }
        in.close();
        return getUserDetail(recommendation_users,user_id);

    }
    //获取具体推荐内容细节
    public String getUserDetail(List<String> recommendation_users,String user_id) throws SQLException {
        System.out.println("getUserDetail");
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        StringBuilder sb = new StringBuilder();
        for(String user : recommendation_users){
            String[]  pair = user.split(":");
            System.out.println(user);
            String sql = "select * from fanfou_schema.user_friend_info where friend_id ='" + pair[0] + "'" + "and user_unique_id ='" + user_id +"'";
            Statement pst =  conn.createStatement();
            ResultSet rs = pst.executeQuery(sql);
            if(rs.next()){
                sb.append(rs.getString("friend_name")).append("  评分:").append(pair[1]).append("&").append(CrawlerUtil.USER_HOME_PAGE).append(rs.getString("friend_id")).append("|");
            }else{
                sb.append(pair[0]).append(pair[1]).append("&").append("|");
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
    public String userTimeLineRecommend(String need_top_k,String alpha,String user_id,String isUserTimeLinePrivate) throws IOException, InterruptedException, SQLException {
        System.out.println("进入userTimeLineRecommend  参数为：" + need_top_k +  alpha+ user_id + isUserTimeLinePrivate);
        String url = "E:\\Study\\毕设\\git-fanfou\\pythonCode\\usertimeline.py";
        String[]  args1 = new String[]{"python",url,need_top_k,alpha,user_id,isUserTimeLinePrivate};
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
        return getItemDetail(recommendation_items,user_id);
    }
    //获取具体推荐内容细节
    public String getItemDetail(List<String> recommendation_items, String user_id) throws SQLException {
        System.out.println("进入getItemDetail");
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        StringBuilder sb = new StringBuilder();
        for(String item_it : recommendation_items){
            String[]  pair = item_it.split(":");
            String sql = "select * from fanfou_schema.user_timeline_not_null where id ='" + pair[0] + "'" +"and user_unique_id = '" +user_id +"'" ;
            Statement pst =  conn.createStatement();
            ResultSet rs = pst.executeQuery(sql);
            if(rs.next()){
                sb.append(rs.getString("text")).append("  评分:").append(pair[1]).append("&").append(CrawlerUtil.SIGINAL_TIMELINE_URL).append(rs.getString("id")).append("|");
            }else{
                sb.append(pair[0]).append(pair[1]).append("&").append("|");
            }
        }
        conn.close();
        System.out.println(sb);
        return  sb.toString();
    }

}
