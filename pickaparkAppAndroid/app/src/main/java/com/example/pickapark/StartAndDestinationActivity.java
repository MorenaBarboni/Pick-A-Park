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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

public class StartAndDestinationActivity extends AppCompatActivity {

    EditText startForm;
    EditText destinationForm;
    TextView errorMessage;
    Button goToParkSpecificationButton;
    Context mContext;

    private RequestQueue mQueue;
    //LatLng destinationCoordinates = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start_and_destination);

        mContext = this;
        mQueue = Volley.newRequestQueue(this);

        startForm = findViewById(R.id.startLocationSAD);
        destinationForm = findViewById(R.id.destinationLocationSAD);
        errorMessage = findViewById(R.id.errorStartAndDestination);
        goToParkSpecificationButton = findViewById(R.id.buttonStartAndDestination);


        goToParkSpecificationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String addressRetrievedStart = startForm.getText().toString();
                String addressRetrievedDestination = destinationForm.getText().toString();

                SingletoonFindAPark.get().setStartAddress(addressRetrievedStart);
                SingletoonFindAPark.get().setDestinationAddress(addressRetrievedDestination);

                findViewById(R.id.loadingPanelSaD).setVisibility(View.VISIBLE);

                final UtilitiesPickAPark util = new UtilitiesPickAPark();
                final ArrayList<EditText> listOfEditable = new ArrayList<>();
                listOfEditable.add(startForm);
                listOfEditable.add(destinationForm);

                if(checkConsistencyRegistration()){
                    util.enableASetEditText(listOfEditable);
                    postRequestDestination(addressRetrievedDestination);
                    postRequestBegin(addressRetrievedStart);
                    findViewById(R.id.loadingPanelSaD).setVisibility(View.INVISIBLE);
                    Handler handler = new Handler();
                    handler.postDelayed(new Runnable() {
                        public void run() {
                            goToFindAParkSelection();
                        }
                    }, 1000);

                }

            }
        });



    }


    private void postRequestDestination(String address) {

        String addressWithoutSpaces = address.replace(" ","+");
        String urlRequest = "https://maps.google.com/maps/api/geocode/json?address=" + addressWithoutSpaces +"&sensor=false&key=AIzaSyATqDVMrdfDU2pr3xvHmbOnH_gjSqovm9s";


        StringRequest sr = new StringRequest(Request.Method.POST, urlRequest, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray results = jsonObject.getJSONArray("results");
                    JSONObject resultsObj = results.getJSONObject(0);
                    JSONObject geometry = resultsObj.getJSONObject("geometry");
                    JSONObject location = geometry.getJSONObject("location");
                    double lat = location.getDouble("lat");
                    double lng = location.getDouble("lng");

                    LatLng destinationCoordinates = new LatLng(lat,lng);
                    SingletoonFindAPark.get().setDestinationCoordinates(destinationCoordinates);

                   // destinationCoordinates = new LatLng(lat,lng);
                    errorMessage.setText("Good!");

                } catch (JSONException e) {
                    e.printStackTrace();
                    errorMessage.setText("JSON parsing error");
                }


            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                errorMessage.setText("Connection problem");
            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                HashMap<String, String> params2 = new HashMap<String, String>();
                params2.put("","");
                return new JSONObject(params2).toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }
        };

        mQueue.add(sr);
    }



    private void postRequestBegin(String address) {

        String addressWithoutSpaces = address.replace(" ","+");
        String urlRequest = "https://maps.google.com/maps/api/geocode/json?address=" + addressWithoutSpaces +"&sensor=false&key=AIzaSyATqDVMrdfDU2pr3xvHmbOnH_gjSqovm9s";


        StringRequest sr = new StringRequest(Request.Method.POST, urlRequest, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    JSONArray results = jsonObject.getJSONArray("results");
                    JSONObject resultsObj = results.getJSONObject(0);
                    JSONObject geometry = resultsObj.getJSONObject("geometry");
                    JSONObject location = geometry.getJSONObject("location");
                    double lat = location.getDouble("lat");
                    double lng = location.getDouble("lng");

                    LatLng destinationCoordinates = new LatLng(lat,lng);
                    SingletoonFindAPark.get().setStartCoordinates(destinationCoordinates);

                    // destinationCoordinates = new LatLng(lat,lng);
                    errorMessage.setText("Good!");

                } catch (JSONException e) {
                    e.printStackTrace();
                    errorMessage.setText("JSON parsing error");
                }


            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                errorMessage.setText("Connection problem");
            }
        }) {
            @Override
            public byte[] getBody() throws AuthFailureError {
                HashMap<String, String> params2 = new HashMap<String, String>();
                params2.put("","");
                return new JSONObject(params2).toString().getBytes();
            }

            @Override
            public String getBodyContentType() {
                return "application/json";
            }
        };

        mQueue.add(sr);
    }


    public boolean checkConsistencyRegistration(){
        boolean allCorrect = true;

        if (destinationForm.getText().toString().equals("")){
            destinationForm.setError("this field cannot be empty");
            allCorrect = false;
        }
        if (startForm.getText().toString().equals("")){
            startForm.setError("this field cannot be empty");
            allCorrect = false;
        }
        return allCorrect;
    }

    public void goToFindAParkSelection(){
        Intent intent = new Intent(this, FindAParkSelectionActivity.class);
        startActivity(intent);
    }


}
