package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.model.LatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class FindAParkSelectionActivity extends AppCompatActivity {

    // default variables for the GET request

    boolean handicap = false;
    boolean coveredParking = false;
    int maxDistance = 10000;
    boolean getDestinationSucceeded = false;

    /*
    LatLng destinationCoordinates = null;
    double latRetrived = 43.141728;
    double lngRetrived = 13.075879;
     */



    Button findAParkButton;
    Spinner car;
    Spinner paymentSpinner;
    Spinner maxDistanceSpinner;


    private CheckBox handicapCB, coveredParkCB;


    TextView errorMessage;


    private RequestQueue mQueue;
    Context mContext;


    // 43.141728, 13.075879


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_find_apark_selection);

        mContext = this;
        mQueue = Volley.newRequestQueue(this);


        findAParkButton = findViewById(R.id.buttonGoToPark);
        car = findViewById(R.id.spinnerCar);
        paymentSpinner = findViewById(R.id.spinnerPayment);
        maxDistanceSpinner = findViewById(R.id.spinnerMaxDistance);


        handicapCB = findViewById(R.id.checkbox_handicap);
        coveredParkCB = findViewById(R.id.checkbox_coveredParking);

        errorMessage = findViewById(R.id.errorSearchingPark);

        initializeSpinners();

        findAParkButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                SingletoonFindAPark.get().setCarPlate(getPlateSelected());
                SingletoonFindAPark.get().setCardSelected(getPayment());

                SingletoonFindAPark.get().setHandicap(handicap);
                SingletoonFindAPark.get().setCoveredPark(coveredParking);
                SingletoonFindAPark.get().setDistanceMax(getMaxDistanceSelected());

                GETRequestDestination();

                Handler handler = new Handler();

                handler.postDelayed(new Runnable() {
                    public void run() {
                        goToBooking();
                    }}, 1000);

            }
        });
    }


    private void initializeSpinners() {

        ArrayList<String> maxDistancesList = new ArrayList<>();


        maxDistancesList.add("50 m");
        maxDistancesList.add("100 m");
        maxDistancesList.add("500 m");
        maxDistancesList.add("1000 m");
        maxDistancesList.add("5000 m");

        ArrayAdapter<String> spinnerArrayAdapterCar = new ArrayAdapter<String> (this, android.R.layout.simple_spinner_item, SingletoonFindAPark.get().getCarPlates());
        ArrayAdapter<String> spinnerArrayAdapterPayment = new ArrayAdapter<String> (this, android.R.layout.simple_spinner_item, SingletoonFindAPark.get().getPaymentCards());
        ArrayAdapter<String> spinnerArrayAdapterDistance = new ArrayAdapter<String> (this, android.R.layout.simple_spinner_item, maxDistancesList);

        car.setAdapter(spinnerArrayAdapterCar);
        paymentSpinner.setAdapter(spinnerArrayAdapterPayment);
        maxDistanceSpinner.setAdapter(spinnerArrayAdapterDistance);

    }

    public void onCheckboxClicked(View view) {
        // Is the view now checked?
        boolean checked = ((CheckBox) view).isChecked();

        // Check which checkbox was clicked
        switch(view.getId()) {
            case R.id.checkbox_handicap:
                if (checked)
                handicap = true;
            else
                handicap = false;
                break;
            case R.id.checkbox_coveredParking:
                if (checked)
                coveredParking = true;
            else
                coveredParking = false;
                break;
        }
    }



    public void goToBooking(){
        Intent intent = new Intent(this, BookingConfirmationActivity.class);

        //intent.putExtra("parkId",parkId);
        //intent.putExtra("plate",plate);
        //intent.putExtra("email",email);
        //intent.putExtra("city",city);
        //intent.putExtra("address",address);
        //intent.putExtra("distanceFromThePark",distanceFromThePark);
        //intent.putExtra("companyId",companyId);

        //String destination = getIntent().getStringExtra("TO");

        startActivity(intent);
    }

    public String urlAPIDestination(){
        String urlDestination ="";
        Common com = new Common();
        urlDestination = urlDestination + com.urlDESTINATION;
        urlDestination = urlDestination + SingletoonFindAPark.get().getDestinationCoordinates().latitude + "/" + SingletoonFindAPark.get().getDestinationCoordinates().longitude;
        //urlDestination = urlDestination + "?indoor=" + coveredParking + "&access=" + handicap + "&maxDistance=" + maxDistance;
        urlDestination = urlDestination + "?indoor=" + coveredParking + "&access=" + handicap + "&maxDistance=" + getMaxDistanceSelected();

        return urlDestination;
    }


    public int getMaxDistanceSelected(){
        String stringDistance = maxDistanceSpinner.getSelectedItem().toString();
        int intDistance = 5000;


        switch(stringDistance)
        {
            case "50 m":
                intDistance = 50;
                break;
            case "100 m":
                intDistance = 100;
                break;
            case "500 m":
                intDistance = 500;
                break;
            case "1000 m":
                intDistance = 1000;
                break;
            case "5000 m":
                intDistance = 5000;
                break;
            default:
                intDistance = 10000;
        }
        return intDistance;
    }


    public String getPlateSelected(){

        String plateSelected = car.getSelectedItem().toString();
        if(plateSelected.equals("")){
            plateSelected = SingletoonFindAPark.get().getCarPlates().get(0);
        }
        return plateSelected;

    }

    public String getPayment(){

        String paymentSelected = paymentSpinner.getSelectedItem().toString();
        if(paymentSelected.equals("")){
            paymentSelected = SingletoonFindAPark.get().getPaymentCards().get(0);
        }
        return paymentSelected;

    }

    private void GETRequestDestination(){


        String urlGET = urlAPIDestination();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, urlGET, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONObject content = response.getJSONObject("content");
                            JSONObject location = content.getJSONObject("location");
                            JSONArray coordinates = location.getJSONArray("coordinates");

                            double coordinatesLat = coordinates.getDouble(1);
                            double coordinatesLon = coordinates.getDouble(0);

                            LatLng parkingCoordinates = new LatLng(coordinatesLat,coordinatesLon);
                            SingletoonFindAPark.get().setParkingCoordinates(parkingCoordinates);

                            SingletoonFindAPark.get().setPrice(content.getDouble("price"));
                            SingletoonFindAPark.get().setCompanyId(content.getString("company"));
                            SingletoonFindAPark.get().setParkId(content.getInt("id"));
                            SingletoonFindAPark.get().setCity(content.getString("city"));
                            SingletoonFindAPark.get().setAddress(content.getString("address"));

                            int distanceFromPark = (int) Math.ceil(content.getDouble("distance"));
                            SingletoonFindAPark.get().setDistanceMax(distanceFromPark);

                            getDestinationSucceeded = true;

                            errorMessage.setText("Park founded!");

                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.e("VOLLEY", e.getMessage());
                            getDestinationSucceeded = false;
                            errorMessage.setText("json error");
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                getDestinationSucceeded = false;
                errorMessage.setText("communication error");
                Log.e("ErrorVOLLEY",error.getMessage());
            }
        });

        mQueue.add(request);

    }



}
