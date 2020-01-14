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

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class LogInActivity extends AppCompatActivity {

    private EditText userId;
    private EditText password;

    private Button logInButton;

    private TextView goBackToMainView;
    private TextView errorMessage;
    private RequestQueue mQueue;

    Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        mContext = this;

        mQueue = Volley.newRequestQueue(this);

        userId = requireViewById(R.id.phoneLogIn);
        password = requireViewById(R.id.passwordLogIn);
        logInButton = requireViewById(R.id.buttonCompleteLogIn);

        goBackToMainView = requireViewById(R.id.notHaveAccount);
        errorMessage = requireViewById(R.id.errorLogIn);

        logInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                final UtilitiesPickAPark util = new UtilitiesPickAPark();
                final ArrayList<EditText> listOfEditable = new ArrayList<>();
                listOfEditable.add(userId);
                listOfEditable.add(password);
                util.disableASetEditText(listOfEditable);

                findViewById(R.id.loadingPanelLogIn).setVisibility(View.VISIBLE);
                //util.enableASetEditText(listOfEditable);
                //findViewById(R.id.loadingPanelLogIn).setVisibility(View.INVISIBLE);
                postRequest();

                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        util.enableASetEditText(listOfEditable);
                        postRequest();
                        findViewById(R.id.loadingPanelLogIn).setVisibility(View.INVISIBLE);
                    }
                }, 1000);

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




    private void postRequest() {
        RequestQueue requestQueue=Volley.newRequestQueue(LogInActivity.this);
        Common com = new Common();
        String url= com.urlLOGIN;
        StringRequest stringRequest=new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //let's parse json data
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    errorMessage.setText("Welcome");
                    int color = Integer.parseInt("87CEEB", 16)+0xFF000000;
                    errorMessage.setTextColor(color);

                    String currentPhone = userId.getText().toString();
                    String currentPassword = password.getText().toString();

                    SessionData.setUsername(mContext, currentPhone);
                    SessionData.setPassword(mContext, currentPassword);

                    goToHomeActivity();


                }
                catch (Exception e){
                    e.printStackTrace();
                    errorMessage.setText("POST DATA : unable to Parse Json");
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                errorMessage.setText("Post Data : Response Failed");

            }
        }){
            @Override
            protected Map<String,String> getParams(){

                // phone=3339393399&password=pass

                Map<String,String> params=new HashMap<String, String>();
                String currentPhone = userId.getText().toString();
                String currentPassword = password.getText().toString();
                //params.put("phone",userId.getText().toString());
                //params.put("password",password.getText().toString());

                params.put("phone",currentPhone);
                params.put("password",currentPassword);

                //params.put("phone","3339393399");
                //params.put("password","pass");

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
