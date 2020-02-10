package com.example.pickapark.Remote;

public class CommonGoogleMaps {
    public static final String baseURL = "https://googleapis.com";
    public static IGoogleApi getGoogleApi(){
        return RetrofitClient.getClient(baseURL).create(IGoogleApi.class);
    }

}
