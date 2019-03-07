package com.fanfou.crawler;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanfou.db.JdbcUtil;
import com.fanfou.db.RedisUtil;
import redis.clients.jedis.Jedis;

import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.sql.*;
import java.util.*;


public class Crawler{

    private static Queue<String> waitId_first=new LinkedList<>();
    //等待爬取的id 2
    private static Queue<String> waitId_second=new LinkedList<>();
    //控制使用哪个队列
    private static boolean is_first=true;
    //访问过的id集合
    private static Set<String> visitedId=new HashSet<>();
    //爬取层数
    private static int plies = 2;
    //当前层数
    private static int cur_plies = 0;
    //游标
    private static int vernier = 0;
    //当前层列数
    private static int cur_plies_size = 0;



    public static void main(String[] args) throws MalformedURLException, SQLException {
        String id = "~Z-lo_exzyRQ";
        Jedis jedis = new Jedis();
        //String a = jedis.lpop("timeLineLog");
        jedis.ltrim("timeLineLog",1,0);
        //System.out.println(a==null);
    }


    //游标操作,针对本层移动
    private void do_vernier(){
        //游标后移
        vernier++;
        //如果这一层遍历完，到下一层，则使用另一个的队列
        if (vernier>=cur_plies_size){
            if (is_first){
                is_first=false;
                cur_plies_size = waitId_second.size();
            }else {
                is_first=true;
                cur_plies_size = waitId_first.size();
            }
            vernier=0;
            cur_plies++;
            System.out.println("进入"+ cur_plies +"层");
        }
    }


    //根据id爬取并入库关注者
    //自定义层数扩展思路：定义两个队列来交叉使用，比如根url装在第一个队列，那么第二个队列用来装根url爬取到的url，第一个队列使用完毕后变为空，又可以使用第一个队列装第三层url
    //通过is_first变量来进行控制使用哪个队列存，切换队列的时机是当本层遍历结束后，因此需要一个游标移动来确定本层是否遍历完毕
    public void Crawler_Friends(String id) throws SQLException, MalformedURLException, FileNotFoundException {
        String user_id = id;
        //通过url和id爬取用户信息和关注者
        waitId_first.add(id);
        Connection conn = JdbcUtil.getConn();
        conn.setAutoCommit(false);
        cur_plies_size = waitId_first.size();
        Jedis jedis = RedisUtil.getJedis();
        //爬两层
        while(cur_plies<plies){
            if (waitId_first.isEmpty() && waitId_second.isEmpty()){
                break;
            }
            System.out.println("当前是第"+ cur_plies +"层");
            if(is_first){
                id = waitId_first.peek();
                waitId_first.remove();
            }else{
                id = waitId_second.peek();
                waitId_second.remove();
            }
            System.out.println("正在处理爬取者："+ id);
            if(visitedId.contains(id)){
                continue;
            }else{
                //将id加入访问过set
                visitedId.add(id);
            }
            String url = CrawlerUtil.FRIENDS_URL + id;
            JSONArray jsonArray = CrawlerUtil.CrawlerArray(url);
            if(jsonArray==null){
                do_vernier();
                continue;
            }
            url = CrawlerUtil.USER_INFO_URL + id;
            JSONObject jsonObject1 = CrawlerUtil.CrawlerObject(url);
            if(jsonObject1==null){
                do_vernier();
                continue;
            }
            Save_Friend_Info(user_id,jsonArray,jsonObject1,conn,jedis);
            do_vernier();
            System.out.println("提交成功");
        }
        System.out.println("爬取完成");
        conn.close();
    }

    /**
     * 存储关注关系
     * @param user_id   好友圈所属用户id
     * @param jsonArray 本次id获取到的好友列表
     * @param id_info 本次id的用户信息
     * @param conn jdbc连接
     * @throws SQLException
     */
    private void Save_Friend_Info(String user_id,JSONArray jsonArray,JSONObject id_info,Connection conn,Jedis jedis) throws SQLException {
        String sql = "insert into fanfou_schema.user_friend_info (user_unique_id,unique_id,name,friend_id,friend_name) values (?,?,?,?,?)";
        PreparedStatement stmt=conn.prepareStatement(sql);
        //将爬取的信息入库，同时将新爬到的id添加到wait队列
        for (Object obj : jsonArray) {
            JSONObject jsonObject = (JSONObject) obj;
            if(jedis.sismember(user_id,
                    id_info.getString("unique_id")+jsonObject.getString("unique_id"))){
                System.out.println("已有！");
                continue;
            }
            //当在遍历第一层的时候，得到的结果应该放到下一层，反之亦然
            if(is_first) {
                waitId_second.add(((JSONObject) obj).getString("unique_id"));
            }else{
                waitId_first.add(((JSONObject) obj).getString("unique_id"));
            }
            jedis.sadd(user_id,id_info.getString("unique_id")+jsonObject.getString("unique_id"));
            stmt.setString(1,user_id);
            stmt.setString(2,id_info.getString("unique_id"));
            stmt.setString(3,id_info.getString("screen_name"));
            System.out.println("关注："+ jsonObject.getString("screen_name"));
            stmt.setString(4,jsonObject.getString("unique_id"));
            stmt.setString(5,jsonObject.getString("screen_name"));
            stmt.addBatch();
        }
        stmt.executeBatch();
        conn.commit();
    }
    //解析用户的消息
    public void Crawler_UserTimeline(String id)
    {

    }


}

