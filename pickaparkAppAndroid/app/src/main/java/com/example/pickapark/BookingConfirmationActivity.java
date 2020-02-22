package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class BookingConfirmationActivity extends AppCompatActivity {

    boolean postBookingSucceeded = false;

    int parkId = 0;
    String carPlate = "";
    String userEmail = "";
    String city = "";
    String address = "";
    double price = 0;
    double distanceFromThePark;
    String companyId = "";


    //String companyId = "";
    //String parkId="";
    //String carPlate = "";
    //String userEmail = "testmail@unicam.it";


    TextView data1;
    TextView data2;
    TextView data3;
    TextView data4;
    TextView data5;
    TextView data6;

    TextView errorMessage;

    Button buttonGoToNavigation;


    private RequestQueue mQueue;
    Context mContext;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_booking_confirmation);

        buttonGoToNavigation = findViewById(R.id.buttonBookingPark);

        mContext = this;
        mQueue = Volley.newRequestQueue(this);


        data1 = findViewById(R.id.data1);
        data2 = findViewById(R.id.data2);
        data3 = findViewById(R.id.data3);
        data4 = findViewById(R.id.data4);
        data5 = findViewById(R.id.data5);
        data6 = findViewById(R.id.parkidtext);
        errorMessage = findViewById(R.id.errorBookingPark);

        /*
        parkId = getIntent().getIntExtra("parkId",0);
        carPlate = getIntent().getStringExtra("plate");
        userEmail = getIntent().getStringExtra("email");
        city = getIntent().getStringExtra("city");
        address = getIntent().getStringExtra("address");
        price = getIntent().getDoubleExtra("price",0);
        distanceFromThePark = getIntent().getDoubleExtra("distanceFromThePark",0);
        distanceFromThePark = Math.ceil(distanceFromThePark);
        companyId = getIntent().getStringExtra("companyId");
        */

        String addressParkingToShow = "Address : "+ SingletoonFindAPark.get().getCity() + " " + SingletoonFindAPark.get().getAddress();
        String companyToShow = "Company : "+ SingletoonFindAPark.get().getCompanyId();
        String priceToShow = "Price : "+ SingletoonFindAPark.get().getPrice();
        String distanceToShow ="Distance : " + SingletoonFindAPark.get().getDistanceMax();
        String parkIdToShow = "Park id : "+SingletoonFindAPark.get().getParkId();

        data1.setText(addressParkingToShow);
        data2.setText(companyToShow);
        data3.setText(priceToShow);
        data4.setText(distanceToShow);
        data6.setText(parkIdToShow);




        buttonGoToNavigation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                postRequest();

                goToMapActivity();
            }
        });
    }



    private void postRequest() {

        Common com = new Common();
        String url= com.urlBOOKING;
        url = url + SingletoonFindAPark.get().getCompanyId() + "/bookings";
        //url = url + "Company1" + "/bookings";

        StringRequest sr = new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                errorMessage.setText(response);
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                errorMessage.setText(error.getMessage());
            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                HashMap<String, String> params2 = new HashMap<String, String>();
                //{"parkingId":1,"plate":"AA000ZZ","email":"lll@fdf.it"}
                String parkIdSingleton = SingletoonFindAPark.get().getParkId()+"";
                String plateSingleton = SingletoonFindAPark.get().getCarPlate();
                String emailSingleton = SingletoonFindAPark.get().getUserEmail();

                params2.put("parkingId", parkIdSingleton);
                params2.put("plate", plateSingleton);
                params2.put("email", emailSingleton);

                return new JSONObject(params2).toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }
        };

        mQueue.add(sr);
    }




    public void goToMapActivity(){
        Intent intent = new Intent(this, MapsActivity.class);
        startActivity(intent);
    }

}
