package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
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

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LogInActivity extends AppCompatActivity {

    private EditText userId;
    private EditText password;

    private Button logInButton;

    private TextView goBackToMainView;
    private RequestQueue mQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);


        mQueue = Volley.newRequestQueue(this);

        userId = requireViewById(R.id.phoneLogIn);
        password = requireViewById(R.id.passwordLogIn);
        logInButton = requireViewById(R.id.buttonCompleteLogIn);

        goBackToMainView = requireViewById(R.id.notHaveAccount);

        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                postRequest();
            }
        });

        goBackToMainView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int color = Integer.parseInt("bdbdbd", 16)+0xFF000000;
                goBackToMainView.setTextColor(color);
                goToMainActivity();
            }
        });


    }

    public void goToMainActivity(){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    public void goToHomeActivity(){
        Intent intent = new Intent(this, HomeActivity.class);
        startActivity(intent);
    }




    /*
    public void loginOperation(){

        //final String currentUserId = userId.getText().toString();
        //final String currentPassword = password.getText().toString();

        //String url = "http://localhost:8080/api/driver-login/3339393399/password/pass";
        String url = "http://192.168.1.32:8080/api/driver-login/3339393399/password/pass";
        //String url = "https://api.myjson.com/bins/bvxqs";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                // cosa succede in caso corretto
                try {
                    JSONArray jsonArray = response.getJSONArray("content");
                    JSONObject userFromDB = jsonArray.getJSONObject(0);
                    String userIdFetched = userFromDB.getString("phone");
                    String passwordFetched = userFromDB.getString("password");
                    goBackToMainView.setText(userIdFetched + passwordFetched);
                }catch (JSONException e){
                    e.printStackTrace();
                }


            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // cosa succede in caso di errore
                error.printStackTrace();
            }
        });

        mQueue.add(request);
    }

*/

    private void postRequest() {
        RequestQueue requestQueue=Volley.newRequestQueue(LogInActivity.this);
        Common com = new Common();
        String url= Common.urlLOGIN;
        StringRequest stringRequest=new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //let's parse json data
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    goToHomeActivity();
                    goBackToMainView.setText("Data 1 : " + jsonObject.getString("message")+"\n");

                }
                catch (Exception e){
                    e.printStackTrace();
                    goBackToMainView.setText("POST DATA : unable to Parse Json");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                goBackToMainView.setText("Post Data : Response Failed");
            }
        }){
            @Override
            protected Map<String,String> getParams(){

                // phone=3339393399&password=pass

                Map<String,String> params=new HashMap<String, String>();
                params.put("phone","3339393399");
                params.put("password","pass");
                return params;
            }

            @Override
            public Map<String,String> getHeaders() throws AuthFailureError{
                Map<String,String> params=new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }
        };

        requestQueue.add(stringRequest);

    }

    private void postRequestRegistration() {
        RequestQueue requestQueue=Volley.newRequestQueue(LogInActivity.this);

        Common com = new Common();
        String url= Common.urlREGISTRATION;

        StringRequest stringRequest=new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //let's parse json data
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    goBackToMainView.setText("Data 1 : " + jsonObject.getString("message")+"\n");
                    //goBackToMainView.append("Data 2 : " + jsonObject.getString("data_2_post")+"\n");
                    //goBackToMainView.append("Data 3 : " + jsonObject.getString("data_3_post")+"\n");
                    //goBackToMainView.append("Data 4 : " + jsonObject.getString("data_4_post")+"\n");
                }
                catch (Exception e){
                    e.printStackTrace();
                    goBackToMainView.setText("POST DATA : unable to Parse Json");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                goBackToMainView.setText("Post Data : Response Failed");
            }
        }){
            @Override
            protected Map<String,String> getParams(){

                // phone=3339393399&password=pass

                Map<String,String> params=new HashMap<String, String>();
                params.put("name","Mario");
                params.put("surname","Mariottide");
                params.put("email","asdasd@dde.it");
                params.put("phone","3339393399");
                params.put("password","pass");
                return params;
            }

            @Override
            public Map<String,String> getHeaders() throws AuthFailureError{
                Map<String,String> params=new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }
        };

        requestQueue.add(stringRequest);

    }

}
