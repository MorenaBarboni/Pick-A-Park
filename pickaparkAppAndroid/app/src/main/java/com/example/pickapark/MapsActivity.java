package com.example.pickapark;

import androidx.fragment.app.FragmentActivity;

import android.animation.ValueAnimator;
import android.graphics.Camera;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.animation.LinearInterpolator;
import android.widget.Button;
import android.widget.Toast;
import android.location.Location.*;

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
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static com.google.android.gms.maps.model.JointType.ROUND;

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
    private String destination;
    private PolylineOptions polylineOptions,blackPolylineOptions;
    private Polyline blackPolyline, greyPolyline;

    private int duration;

    private LatLng myLocation;

    IGoogleApi mService;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        //mapFragment.getMapAsync(this);

        polylineList = new ArrayList<>();
        btnGo = findViewById(R.id.startNavigationMap);

        btnGo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                destination = "Via Pallotta 2 Camerino MC";
                destination = destination.replace(" ","+");
                mapFragment.getMapAsync(MapsActivity.this);

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
                    "origin="+sidney.latitude+","+sidney.longitude+"&"+
                    "destination="+destination+"&"+
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
                                polylineAnimator.setDuration(duration*1000);
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

















}
