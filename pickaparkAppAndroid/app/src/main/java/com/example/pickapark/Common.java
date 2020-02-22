package com.example.pickapark;

public class Common {
    public static  String domain ="192.168.1.118";
    public static String urlGENERIC = "";
    public static String urlLOGIN ="";
    public static String urlREGISTRATION = "";
    public static String urlDESTINATION = "";
    public static String urlBOOKING= "";

    public Common(){

        this.urlGENERIC = "http://"+ this.domain +":8080/api/";
        this.urlLOGIN = "http://"+ this.domain +":8080/api/driver-login";
        this.urlREGISTRATION = "http://"+ this.domain +":8080/api/driver";
        this.urlDESTINATION = "http://"+ this.domain +":8080/api/destination/";
        this.urlBOOKING = "http://"+ this.domain +":8080/api/companies/"; //nomeCompagnia/bookings";
    }

}
