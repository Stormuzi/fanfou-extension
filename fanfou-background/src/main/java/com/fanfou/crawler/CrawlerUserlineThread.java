package com.fanfou.crawler;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanfou.db.JdbcUtil;
import com.fanfou.db.RedisUtil;
import org.jsoup.helper.StringUtil;
import redis.clients.jedis.Jedis;

import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;


public class CrawlerUserlineThread{

    //等待爬取的id队列一层
    private static Queue<String> waitId=new LinkedList<>();
    //等待爬取的id队列二层
    private static Queue<String> waitId2=new LinkedList<>();
    //访问过的id集合
    private static Set<String> visitedId=new HashSet<>();

    public static void main(String[] args) throws MalformedURLException, SQLException, FileNotFoundException {
        String id = "~Z-lo_exzyRQ";

    }

    private static void Save_Usertimeline(JSONArray userTimeLines, Connection conn,String unique_id,Jedis jedis) throws SQLException {
        String userTimeLineSql = "insert into fanfou_schema.user_timeline " +
                "(id,rawid,text,truncated,in_reply_to_status_id,in_reply_to_user_id,favorited,in_reply_to_screen_name," +
                "is_self,repost_screen_name,repost_status_id,repost_user_id,user_unique_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        String userTimeLineNotNullSql = "insert into fanfou_schema.user_timeline_not_null " +
                "(id,rawid,text,truncated,in_reply_to_status_id,in_reply_to_user_id,favorited,in_reply_to_screen_name," +
                "is_self,repost_screen_name,repost_status_id,repost_user_id,user_unique_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";

        if (userTimeLines == null){
            return;
        }

        PreparedStatement stmt=conn.prepareStatement(userTimeLineSql);
        PreparedStatement stmtNotNull=conn.prepareStatement(userTimeLineNotNullSql);
        Boolean notNullExist = false;
        for (Object obj: userTimeLines){
            JSONObject jsonObject = (JSONObject) obj;
            //去重
            if(jedis.sismember(unique_id+"timeLine",jsonObject.getString("id"))){
                //System.out.println("已有！");
                continue;
            }
            jedis.sadd(unique_id+"timeLine",jsonObject.getString("id"));
            Save_Single_UsertimeLine(jsonObject,stmt,unique_id);
            if(!StringUtil.isBlank(jsonObject.getString("in_reply_to_status_id"))
                    || !StringUtil.isBlank(jsonObject.getString("in_reply_to_user_id"))
                    ||!StringUtil.isBlank(jsonObject.getString("in_reply_to_screen_name"))
                    ||!StringUtil.isBlank(jsonObject.getString("repost_screen_name"))
                    ||!StringUtil.isBlank(jsonObject.getString("repost_status_id"))
                    ||!StringUtil.isBlank(jsonObject.getString("repost_user_id"))){
              Save_Single_UsertimeLine(jsonObject,stmtNotNull,unique_id);
              notNullExist = true;
            }
        }
        stmt.executeBatch();
        if(notNullExist){
            stmtNotNull.executeBatch();
        }
        conn.commit();
    }

    private static void Save_Single_UsertimeLine(JSONObject jsonObject,PreparedStatement stmt,String unique_id ) throws SQLException {
        stmt.setString(1,jsonObject.getString("id"));
        stmt.setString(2,jsonObject.getString("rawid"));
        stmt.setString(3,jsonObject.getString("text"));
        stmt.setString(4,jsonObject.getString("truncated"));
        stmt.setString(5,jsonObject.getString("in_reply_to_status_id"));
        stmt.setString(6,jsonObject.getString("in_reply_to_user_id"));
        stmt.setString(7,jsonObject.getString("favorited"));
        stmt.setString(8,jsonObject.getString("in_reply_to_screen_name"));
        stmt.setString(9,jsonObject.getString("is_self"));
        stmt.setString(10,jsonObject.getString("repost_screen_name"));
        stmt.setString(11,jsonObject.getString("repost_status_id"));
        stmt.setString(12,jsonObject.getString("repost_user_id"));
        stmt.setString(13,unique_id);
        stmt.addBatch();
    }


    public void test(String idt) throws SQLException, MalformedURLException, FileNotFoundException {
        String url = CrawlerUtil.FRIENDS_URL+idt;
        JSONArray jsonArray = CrawlerUtil.CrawlerArray(url);
        Jedis jedis = RedisUtil.getJedis();
        //清空日志
        jedis.ltrim("timeLineLog",1,0);
        visitedId.add(idt);
        if (jsonArray == null){
            System.out.println("给的用户没有关注，无法推荐");
            return;
        }
        //将用户关注列表放入第一层，且放入set
        for (Object obj : jsonArray) {
            JSONObject jsonObject = (JSONObject) obj;
            System.out.println("用户好友"+jsonObject.getString("unique_id"));
            waitId.add(jsonObject.getString("unique_id"));
            visitedId.add(jsonObject.getString("unique_id"));
        }

        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        System.out.println("开始爬取第一层");
        while(!waitId.isEmpty()){

            url = CrawlerUtil.FRIENDS_URL + waitId.peek();
            //爬取第一层用户的好友列表,放入第二层队列
            JSONArray first_plie = CrawlerUtil.CrawlerArray(url);
            if (first_plie == null){
                waitId.remove();
                continue;
            }
            for (Object obj: first_plie ) {
                JSONObject jsonObject = (JSONObject) obj;
                //确保不会重复爬取
                if(visitedId.contains(jsonObject.getString("unique_id"))) {
                    continue;
                }
                waitId2.add(jsonObject.getString("unique_id"));
                visitedId.add(jsonObject.getString("unique_id"));
            }
            //爬取第一层节点的用户消息，存入数据库
            url = CrawlerUtil.USER_TIMELINE_URL + waitId.peek();
            JSONArray userTimeLines = CrawlerUtil.CrawlerArray(url);
            System.out.println("正在处理用户:"+waitId.peek());
            jedis.lpush("timeLineLog","正在处理用户: "+waitId.peek());
            Save_Usertimeline(userTimeLines,conn,idt,jedis);
            System.out.println("提交成功");
            waitId.remove();

        }
        System.out.println("第一层爬取、入库完毕,开始爬取、入库第二层");
        while(!waitId2.isEmpty()){
            url = CrawlerUtil.USER_TIMELINE_URL + waitId2.peek();
            System.out.println("正在处理：用户好友:"+waitId2.peek());
            jedis.lpush("timeLineLog","正在处理用户: "+waitId2.peek());
            JSONArray userTimeLines = CrawlerUtil.CrawlerArray(url);
            if (userTimeLines == null){
                waitId2.remove();
                continue;
            }
            Save_Usertimeline(userTimeLines,conn,idt,jedis);
            System.out.println("提交成功");
            waitId2.remove();

        }
        System.out.println("第二层爬取、入库完毕");
        conn.close();
    }
}
