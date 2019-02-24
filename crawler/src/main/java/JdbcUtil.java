import java.sql.*;

public class JdbcUtil {
    //通过properties工具就可以获取到properties文件中的键值从而可以加载驱动 获取链接 从而 可以增删改查
    private static Connection conn = null;

    public static Connection getConn(){
        PropertiesUtil.loadFile("jdbc.properties");
        String driver = PropertiesUtil.getPropertyValue("driver");
        String url = PropertiesUtil.getPropertyValue("url");
        String username  = PropertiesUtil.getPropertyValue("username");
        String password = PropertiesUtil.getPropertyValue("password");
        try{
            Class.forName(driver);
            conn = DriverManager.getConnection(url,username,password);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
            close();
        }
        return conn;
    }
    public static void close(){
         try {
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
         }
    }
    private static String getPasswordByUserName(String userName) throws SQLException {
        String sql = "select password from users where username = " +"'" + userName+"'";
        Connection conn = JdbcUtil.getConn();
        Statement stmt=null;
        ResultSet ret = null;
        String password=null;
        stmt = conn.createStatement();
        ret = stmt.executeQuery(sql);
        while(ret.next()){
            password = ret.getString(1);
        }
        ret.close();
        conn.close();
        return  password;
    }

}


