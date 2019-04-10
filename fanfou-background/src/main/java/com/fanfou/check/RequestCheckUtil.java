package com.fanfou.check;

import org.jsoup.helper.StringUtil;

import javax.servlet.http.HttpServletRequest;
import java.text.DecimalFormat;
import java.util.regex.Pattern;

public class RequestCheckUtil {
    private RequestCheckUtil (){

    }
    public static boolean isFriendRequestLegal(HttpServletRequest request){
        if(!isUserIdLegal(request)){
            return false;
        }
        if(!StringUtil.isNumeric(request.getParameter("URAtop_k"))){
            return false;
        }else{
            int URAtop_k = Integer.parseInt(request.getParameter("URAtop_k"));
            if(URAtop_k>10 || URAtop_k<=0){
                return false;
            }
            System.out.println("URAtop_k: " + URAtop_k);
            System.out.println("selectURA:" + request.getParameter("selectURA"));
        }
        return true;
    }
    public static boolean isUserIdLegal(HttpServletRequest request){
        if(request.getParameter("user_id") == null){
            return false;
        }
        return true;
    }

    public static boolean isUserTimeLineRequestLegal(HttpServletRequest request){
        if(!isUserIdLegal(request)){
            return false;
        }
        if(!StringUtil.isNumeric(request.getParameter("CRAtop_k"))){
            return false;
        }else{
            int CRAtop_k = Integer.parseInt(request.getParameter("CRAtop_k"));
            if(CRAtop_k>15 || CRAtop_k<=0){
                return false;
            }
            System.out.println("CRAtop_k: " + CRAtop_k);
        }
        if(!isNumeric(request.getParameter("CRAalpha").trim())){
            return false;
        }else{
            Double CRAalpha = Double.parseDouble(request.getParameter("CRAalpha").trim());
            DecimalFormat decimalFormat = new DecimalFormat("#0.0");
            CRAalpha = Double.parseDouble(decimalFormat.format(CRAalpha));
            if(CRAalpha>10 || CRAalpha<=0){
                return false;
            }
            System.out.println("CRAalpha: " + CRAalpha);
        }

        return true;
    }
    public static boolean isNumeric(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        if (str.indexOf(".") > 0) {//判断是否有小数点
            if (str.indexOf(".") == str.lastIndexOf(".") && str.split("\\.").length == 2) { //判断是否只有一个小数点
                return pattern.matcher(str.replace(".", "")).matches();
            } else {
                return false;
            }
        } else {
            return pattern.matcher(str).matches();
        }
    }

}
