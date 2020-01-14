package com.example.pickapark;

public class Common {
    public static  String domain ="10.0.1.60";
    public static String urlGENERIC = "";
    public static  String urlLOGIN ="";
    public static  String urlREGISTRATION = "";

    public Common(){

        this.urlGENERIC = "http://"+ this.domain +":8080/api/";
        this.urlLOGIN = "http://"+ this.domain +":8080/api/driver-login";
        this.urlREGISTRATION = "http://"+ this.domain +":8080/api/driver";

    }

}
