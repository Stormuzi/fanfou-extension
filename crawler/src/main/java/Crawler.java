
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.sql.*;
import java.util.*;

public class Crawler {
    //等待爬取的id 1
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

    }
    //游标操作
    private static void do_vernier(){
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


    //解析爬取到的关注者
    public static void Crawler_Friends() throws SQLException, MalformedURLException {
        //通过url和id爬取用户信息和关注者
        String id = "~Z-lo_exzyRQ";
        waitId_first.add(id);
        String sql = "insert into fanfou_schema.user_friend_info (unique_id,name,friend_id,friend_name) values (?,?,?,?)";
        Connection conn = JdbcUtil.getConn();
        PreparedStatement stmt=conn.prepareStatement(sql);
        conn.setAutoCommit(false);
        cur_plies_size = waitId_first.size();
        //爬两层
        while(cur_plies<plies){
            System.out.println("当前是第"+ cur_plies +"层");
            if(is_first){
                id = waitId_first.peek();
                waitId_first.remove();
            }else{
                id = waitId_second.peek();
                waitId_second.remove();
            }
            System.out.println("爬取者："+ id);
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
            //将爬取的信息入库，同时将新爬到的添加到wait队列
            for (Object obj : jsonArray) {
                JSONObject jsonObject = (JSONObject) obj;
                //当在遍历第一层的时候，得到的结果应该放到下一层
                if(is_first) {
                    waitId_second.add(((JSONObject) obj).getString("id"));
                }else{
                    waitId_first.add(((JSONObject) obj).getString("id"));
                }
                stmt.setString(1,id);
                stmt.setString(2,jsonObject1.getString("screen_name"));
                System.out.println("关注："+ jsonObject.getString("id"));
                stmt.setString(3,jsonObject.getString("id"));
                stmt.setString(4,jsonObject.getString("screen_name"));
                stmt.addBatch();
            }
            stmt.executeBatch();
            conn.commit();
            do_vernier();
            System.out.println("提交成功");
        }
        System.out.println("爬取完成");
        conn.close();
    }
    //解析用户的消息
    public static void parseUserTimeline()
    {

    }
}

