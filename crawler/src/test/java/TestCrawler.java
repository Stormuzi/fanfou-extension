
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import jdk.nashorn.internal.runtime.regexp.joni.constants.Arguments;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class TestCrawler {

    public static void main(String[] args) throws MalformedURLException {

        String url = "http://api.fanfou.com/statuses/user_timeline.json?id=~GLQOQzd6ayw";
        JSONArray jsonArray = Crawler(url);
        for (Object obj : jsonArray) {
            JSONObject jsonObject = (JSONObject) obj;
            System.out.println(jsonObject.getString("id")+" : " + jsonObject.getString("created_at") +" 内容： "+ jsonObject.getString("text"));
            
        }

    }

    public static JSONArray Crawler(String url) throws MalformedURLException {
        InputStreamReader reader = null;
        BufferedReader in = null;
        URL httpUrl = new URL(url);
        try {
            URLConnection connection = httpUrl.openConnection();
            connection.setConnectTimeout(1000);
            reader = new InputStreamReader(connection.getInputStream(), "UTF-8");
            in = new BufferedReader(reader);
            String line = null;//每行内容
            StringBuffer content = new StringBuffer();
            while ((line = in.readLine()) != null) {
                content.append(line);
            }
            if (content.length() != 0) {
                //String jsonStr = content.toString().replaceAll("\\n", "");
                String jsonStr = content.toString();
                JSONArray jsonArray = JSON.parseArray(jsonStr);

                return jsonArray;
            }


        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                reader.close();
                in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }


        }
        return null;
    }
}
