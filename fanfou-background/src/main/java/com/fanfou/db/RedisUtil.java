package com.fanfou.db;

import redis.clients.jedis.Jedis;

import java.net.MalformedURLException;

public class RedisUtil {

    public static void main(String[] args) throws MalformedURLException {

    }

    /**
     * 两个线程访问，不用单例
     * @return
     */
    public static Jedis getJedis(){
        Jedis jedis = new Jedis("localhost");
        if(!jedis.isConnected()){
            System.out.println("redis 没有启动！！");
        }
        System.out.println("连接成功");
        //查看服务是否运行
        System.out.println("服务正在运行: "+jedis.ping());
        return jedis;
    }
}
