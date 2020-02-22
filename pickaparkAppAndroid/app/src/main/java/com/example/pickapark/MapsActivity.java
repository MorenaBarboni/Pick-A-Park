package com.example.pickapark;

import androidx.fragment.app.FragmentActivity;

import android.animation.ValueAnimator;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.animation.LinearInterpolator;
import android.widget.Button;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.pickapark.Remote.CommonGoogleMaps;
import com.example.pickapark.Remote.IGoogleApi;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.JointType;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.android.gms.maps.model.SquareCap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    SupportMapFragment mapFragment;
    private List<LatLng> polylineList;
    private Marker marker;
    private float v;
    private double lng, lat;
    private Handler handler;
    private LatLng startPositon,endPosition;
    private int index,next;
    private Button btnGo;
    private Button btnNewRoute;
    private String destination;
    private PolylineOptions polylineOptions,blackPolylineOptions;
    private Polyline blackPolyline, greyPolyline;
    private boolean buttonClicked = false;

    private int realDuration;
    private int duration;

    private LatLng currentPos;


    // From the get
    private LatLng lastNearestParkRetrived;
    double newPrice = 0;
    String newCompanyId = "";
    int newParkId = 0;
    String newCity = "";
    String newAddress = "";
    int newDistance = 0;


    private Handler mHandler = new Handler();

    IGoogleApi mService;


    private RequestQueue mQueue;
    Context mContext;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        //mapFragment.getMapAsync(this);

        mContext = this;
        mQueue = Volley.newRequestQueue(this);

        currentPos = SingletoonFindAPark.get().getStartCoordinates();

        polylineList = new ArrayList<>();
        btnGo = findViewById(R.id.startNavigationMap);
        btnNewRoute = findViewById(R.id.getNewDestinationButton);

        btnNewRoute.setEnabled(false);

        btnGo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!buttonClicked){
                    btnGo.setText("Cancel");
                    buttonClicked =true;
                    startRepeating();
                    mapFragment.getMapAsync(MapsActivity.this);
                }
                else{
                    buttonClicked =true;
                    stopRepeating();
                    goToHomeActivity();
                }
            }
        });

        btnNewRoute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stopRepeating();
                goToBooking();
            }
        });

        mService = CommonGoogleMaps.getGoogleApi();

    }

    private List<LatLng> decodePoly(String encoded) {
        List<LatLng> poly = new ArrayList<>();
        int index = 0, len = encoded.length();
        int lat = 0, lng = 0;

        while (index < len) {
            int b, shift = 0, result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            int dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            LatLng p = new LatLng((((double) lat / 1E5)),
                    (((double) lng / 1E5)));
            poly.add(p);
        }

        return poly;
    }

    private float getBearing(LatLng startPositon, LatLng newPos){
        double lat = Math.abs(startPositon.latitude-newPos.latitude);
        double lng = Math.abs(startPositon.longitude-newPos.longitude);

        if(startPositon.latitude < newPos.latitude && startPositon.longitude < newPos.longitude)
            return (float) (Math.toDegrees(Math.atan(lng/lat)));
        else if(startPositon.latitude >= newPos.latitude && startPositon.longitude < newPos.longitude)
            return (float) ((90 - Math.toDegrees(Math.atan(lng/lat))) + 90);
        else if(startPositon.latitude >= newPos.latitude && startPositon.longitude >= newPos.longitude)
            return (float) (Math.toDegrees(Math.atan(lng/lat)) + 180);
        else if(startPositon.latitude < newPos.latitude && startPositon.longitude >= newPos.longitude)
            return (float) ((90 - Math.toDegrees(Math.atan(lng/lat))) + 270);
        return -1;
    }


    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {



        mMap = googleMap;

        mMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);
        mMap.setTrafficEnabled(false);
        mMap.setBuildingsEnabled(false);
        mMap.getUiSettings().setZoomControlsEnabled(true);

        // Add a marker in Sydney and move the camera
        //LatLng sydney = new LatLng(16.0659970, 108.212552);
        // 43.164494, 13.058762
        // 43.143778, 13.066422
        final LatLng sidney = new LatLng(43.143778, 13.066422);
        mMap.addMarker(new MarkerOptions().position(sidney).title("My location"));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(sidney));
        mMap.moveCamera(CameraUpdateFactory.newCameraPosition(new CameraPosition.Builder()
                .target(googleMap.getCameraPosition().target)
                .zoom(17)
                .bearing(30)
                .tilt(45)
                .build()
        ));
        String requestUrl = null;
        try {
            requestUrl = "https://maps.googleapis.com/maps/api/directions/json?"+
                    "mode=driving&"+
                    "transit_routing_preference=less_driving&"+
                    "origin="+SingletoonFindAPark.get().getStartCoordinates().latitude+","+SingletoonFindAPark.get().getStartCoordinates().longitude+"&"+
                    "destination="+SingletoonFindAPark.get().getDestinationCoordinates().latitude+","+SingletoonFindAPark.get().getDestinationCoordinates().longitude+"&"+
                    //"destination="+destination+"&"+
                    "key="+getResources().getString(R.string.google_directions_key);
            Log.d("URL",requestUrl);
            mService.getDataFromGoogleApi(requestUrl)
                    .enqueue(new Callback<String>() {
                        @Override
                        public void onResponse(Call<String> call, Response<String> response) {
                            try {
                                JSONObject jsonObject = new JSONObject(response.body().toString());
                                JSONArray jsonArray = jsonObject.getJSONArray("routes");
                                for (int i=0;i<jsonArray.length();i++){
                                    JSONObject route = jsonArray.getJSONObject(i);
                                    JSONObject poly = route.getJSONObject("overview_polyline");

                                    JSONArray legs = route.getJSONArray("legs");
                                    JSONObject legsObj = legs.getJSONObject(0);
                                    int seconds = legsObj.getJSONObject("duration").getInt("value");
                                    realDuration = seconds;
                                    int minutes = (int) Math.ceil(seconds/60)+1;
                                    duration = minutes * 60;

                                    Log.d("duration", ""+duration);

                                    String polyline = poly.getString("points");
                                    polylineList = decodePoly(polyline);
                                }

                                // adjusting bounds
                                LatLngBounds.Builder builder = new LatLngBounds.Builder();
                                for(LatLng latLng : polylineList){
                                    builder.include(latLng);
                                }

                                LatLngBounds bounds = builder.build();
                                CameraUpdate mCameraUpdate = CameraUpdateFactory.newLatLngBounds(bounds,2);
                                mMap.animateCamera(mCameraUpdate);

                                polylineOptions = new PolylineOptions();
                                polylineOptions.color(Color.GRAY);
                                polylineOptions.width(5);
                                polylineOptions.startCap(new SquareCap());
                                polylineOptions.endCap(new SquareCap());
                                polylineOptions.jointType(JointType.ROUND);
                                polylineOptions.addAll(polylineList);
                                greyPolyline = mMap.addPolyline(polylineOptions);

                                blackPolylineOptions = new PolylineOptions();
                                blackPolylineOptions.color(Color.BLUE);
                                blackPolylineOptions.width(8);
                                blackPolylineOptions.startCap(new SquareCap());
                                blackPolylineOptions.endCap(new SquareCap());
                                blackPolylineOptions.jointType(JointType.ROUND);
                                blackPolylineOptions.addAll(polylineList);
                                blackPolyline = mMap.addPolyline(blackPolylineOptions);

                                mMap.addMarker(new MarkerOptions().position(polylineList.get(polylineList.size()-1)));

                                //Animator

                                final ValueAnimator polylineAnimator = ValueAnimator.ofInt(0,100);
                                polylineAnimator.setDuration(realDuration*1000);
                                polylineAnimator.setInterpolator(new LinearInterpolator());
                                polylineAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                                    @Override
                                    public void onAnimationUpdate(ValueAnimator animation) {
                                        List<LatLng> points = greyPolyline.getPoints();
                                        int percentValue = (int) animation.getAnimatedValue();
                                        int size = points.size();
                                        int newPoints = (int) (size * (percentValue / 100.0f));
                                        List<LatLng> p = points.subList(0,newPoints);
                                        blackPolyline.setPoints(p);
                                    }
                                });

                                polylineAnimator.start();
                                //Add car marker
                                marker = mMap.addMarker(new MarkerOptions().position(sidney)
                                        .flat(true)
                                        .icon(BitmapDescriptorFactory.fromResource(R.drawable.carmarker)));
                                handler = new Handler();
                                index = -1;
                                next = 1;
                                handler.postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        if (index < polylineList.size()-1){
                                            index++;
                                            next = index+1;
                                        }
                                        if (index < polylineList.size()-1){
                                            startPositon = polylineList.get(index);
                                            endPosition = polylineList.get(next);
                                        }
                                        final ValueAnimator valueAnimator = ValueAnimator.ofFloat(0,1);
                                        valueAnimator.setDuration(3000);
                                        valueAnimator.setInterpolator(new LinearInterpolator());
                                        valueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                                            @Override
                                            public void onAnimationUpdate(ValueAnimator animation) {
                                                v = valueAnimator.getAnimatedFraction();
                                                lng = v*endPosition.longitude+(1-v)*startPositon.longitude;
                                                lat = v*endPosition.latitude+(1-v)*startPositon.latitude;

                                                Log.d("position", "long: "+lng+"lat: "+lat);

                                                LatLng newPos = new LatLng(lat,lng);
                                                //currentPos = newPos;
                                                marker.setPosition(newPos);
                                                marker.setAnchor(0.5f,0.5f);
                                                //marker.setRotation(getBearing(startPositon,newPos));
                                                mMap.moveCamera(CameraUpdateFactory.newCameraPosition(new CameraPosition.Builder()
                                                        .target(newPos)
                                                        .zoom(15.5f)
                                                        .build()));

                                            }
                                        });

                                        valueAnimator.start();
                                        handler.postDelayed(this,3000);
                                    }
                                },3000);



                            }catch (Exception e){
                                e.printStackTrace();
                            }
                        }

                        @Override
                        public void onFailure(Call<String> call, Throwable t) {
                            Toast.makeText(MapsActivity.this,""+t.getMessage(),Toast.LENGTH_SHORT).show();
                        }
                    });

        }
        catch (Exception e){
            e.printStackTrace();
        }
    }


    public void goToHomeActivity(){
        Intent intent = new Intent(this, HomeActivity.class);
        startActivity(intent);
    }

    public void goToBooking(){
        Intent intent = new Intent(this, BookingConfirmationActivity.class);
        startActivity(intent);
    }




    public String urlAPIDestination(){
        String urlDestination ="";
        Common com = new Common();
        urlDestination = urlDestination + com.urlDESTINATION;
        urlDestination = urlDestination + SingletoonFindAPark.get().getDestinationCoordinates().latitude + "/" + SingletoonFindAPark.get().getDestinationCoordinates().longitude;
        urlDestination = urlDestination + "?indoor=" + SingletoonFindAPark.get().isCoveredPark() + "&access=" + SingletoonFindAPark.get().isHandicap() + "&maxDistance=" + SingletoonFindAPark.get().getDistanceMax();

        return urlDestination;
    }



    private void GETRequestDestination(){


        String urlGET = urlAPIDestination();

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, urlGET, null,
                new com.android.volley.Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            JSONObject content = response.getJSONObject("content");
                            JSONObject location = content.getJSONObject("location");
                            JSONArray coordinates = location.getJSONArray("coordinates");

                            double coordinatesLat = coordinates.getDouble(1);
                            double coordinatesLon = coordinates.getDouble(0);

                            LatLng newParkingCoordinates = new LatLng(coordinatesLat,coordinatesLon);
                            lastNearestParkRetrived = newParkingCoordinates;

                            newPrice = content.getDouble("price");
                            newCompanyId = content.getString("company");
                            newParkId = content.getInt("id");
                            newCity = content.getString("city");
                            newAddress = content.getString("address");
                            newDistance = (int) Math.ceil(content.getDouble("distance"));


                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.e("VOLLEY", e.getMessage());
                            //getDestinationSucceeded = false;
                            //errorMessage.setText("json error");
                        }
                    }
                }, new com.android.volley.Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                //getDestinationSucceeded = false;
                //errorMessage.setText("communication error");
                Log.e("ErrorVOLLEY",error.getMessage());
            }
        });

        mQueue.add(request);

    }


    public void startRepeating() {
        searchForNearestPark.run();
    }

    public void stopRepeating() {
        mHandler.removeCallbacks(searchForNearestPark);
    }

    private Runnable searchForNearestPark = new Runnable() {
        @Override
        public void run() {
            GETRequestDestination();
            //Toast.makeText(MapsActivity.this, "Searching nearest park", Toast.LENGTH_SHORT).show();
            Toast.makeText(MapsActivity.this, "la"+currentPos.latitude+"lo"+currentPos.longitude, Toast.LENGTH_SHORT).show();
            mHandler.postDelayed(new Runnable() {
                public void run() {
                    if(!lastNearestParkRetrived.equals(SingletoonFindAPark.get().getDestinationCoordinates())){
                        SingletoonFindAPark.get().setStartCoordinates(currentPos);
                        SingletoonFindAPark.get().setDestinationCoordinates(lastNearestParkRetrived);

                        SingletoonFindAPark.get().setPrice(newPrice);
                        SingletoonFindAPark.get().setCompanyId(newCompanyId);
                        SingletoonFindAPark.get().setParkId(newParkId);
                        SingletoonFindAPark.get().setCity(newCity);
                        SingletoonFindAPark.get().setAddress(newAddress);
                        SingletoonFindAPark.get().setDistanceMax(newDistance);

                        btnNewRoute.setEnabled(true);
                    }
                }
            }, 1000);

            mHandler.postDelayed(this, 5000);
        }
    };






}
