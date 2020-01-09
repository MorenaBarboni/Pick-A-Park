package com.example.pickapark;

import java.util.ArrayList;

public class UserData {

    private String strID;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String password;
    private String payment;
    private Coordinates address;
    //private Car[] cars ={};
    ArrayList<Car> cars = new ArrayList<>();

    //String[] address = new String[2];

    boolean hadAtLeastACar = false;
    boolean hadAPayementMethod=false;

    public UserData(String strID, String name, String surname, String email, String phone, String password, String payment, String lat, String lon) {
        this.strID = strID;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.payment = payment;
        this.address = new Coordinates(lat,lon);
    }







}

 class Coordinates{

     private String lat;
     private String lon;

     public Coordinates(String latitude, String longitude){
         lat = latitude;
         lon = longitude;
     }

     public String getLat() {
         return lat;
     }

     public String getLon() {
         return lon;
     }

     public void setLat(String lat) {
         this.lat = lat;
     }

     public void setLon(String lon) {
         this.lon = lon;
     }

 }


