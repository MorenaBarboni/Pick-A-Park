package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import 	java.util.regex.*;

import android.os.Handler;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class RegistrationActivity extends AppCompatActivity {

    private TextView goBackToMainView;

    private Button signInButton;

    private EditText nameField;
    private EditText surNameField;
    private EditText eMailField;
    private EditText phoneField;
    private EditText passwordField;

    private TextView errorMessage;

    Context mContext;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration);
        mContext = this;

        goBackToMainView = requireViewById(R.id.alredyHaveAccount);

        signInButton = requireViewById(R.id.buttonCompleteRegistration);

        nameField = requireViewById(R.id.nameRegistration);
        surNameField = requireViewById(R.id.surnameRegistration);
        eMailField = requireViewById(R.id.emailRegistation);
        phoneField = requireViewById(R.id.phoneRegistation);
        passwordField = requireViewById(R.id.passwordRegistration);

        errorMessage = requireViewById(R.id.errorReg);

        goBackToMainView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int color = Integer.parseInt("bdbdbd", 16)+0xFF000000;
                goBackToMainView.setTextColor(color);
                setGoBackToMainView();
            }
        });

        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean consistentDataProvided = checkConsistencyRegistration();
                boolean consistencyInDatabase = checkConsistencyRegistration();
                if(consistentDataProvided && consistencyInDatabase){
                    findViewById(R.id.loadingPanel).setVisibility(View.VISIBLE);

                    final UtilitiesPickAPark util = new UtilitiesPickAPark();
                    final ArrayList<EditText> listOfEditable = new ArrayList<>();
                    listOfEditable.add(nameField);
                    listOfEditable.add(surNameField);
                    listOfEditable.add(eMailField);
                    listOfEditable.add(phoneField);
                    listOfEditable.add(passwordField);
                    util.disableASetEditText(listOfEditable);

                    Handler handler = new Handler();
                    handler.postDelayed(new Runnable() {
                        public void run() {
                            util.enableASetEditText(listOfEditable);
                            postRequestRegistration();
                            findViewById(R.id.loadingPanel).setVisibility(View.INVISIBLE);
                        }
                    }, 3000);   //5 seconds

                }
            }
        });

    }

    public void setGoBackToMainView(){
        Intent intet = new Intent(this, MainActivity.class);
        startActivity(intet);
    }



    public boolean checkConsistencyRegistration(){
        boolean allCorrect = true;

        if (nameField.getText().toString().equals("")){
            nameField.setError("this field cannot be empty");
            allCorrect = false;
        }
        if (surNameField.getText().toString().equals("")){
            surNameField.setError("this field cannot be empty");
            allCorrect = false;
        }
        if (!isEmailValid(eMailField.getText().toString())){
            eMailField.setError("not a valid email");
            allCorrect = false;
        }
        if (!isPhoneValid(phoneField.getText().toString())){
            phoneField.setError("not a phone number");
            allCorrect = false;
        }
        if(passwordField.getText().toString().length()<=8){
            passwordField.setError("at least 8 character");
            allCorrect = false;
        }
        return allCorrect;
    }



    public static boolean isEmailValid(String email) {
        String expression = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public static boolean isPhoneValid(String phone) {
        //if (!phoneField.getText().toString().matches("-?\\d+(\\.\\d+)?") && phoneField.getText().toString().length()<=3){
        if(phone.length()<=3){
            return false;
        }
        String expression = "-?\\d+(\\.\\d+)?";
        Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(phone);
        return matcher.matches();
    }

    public JSONObject jsonFormat(){
        JSONObject registrationJSON = new JSONObject();
        try {
            registrationJSON.put("name",nameField.getText().toString());
            registrationJSON.put("surname",surNameField.getText().toString());
            registrationJSON.put("phone",phoneField.getText().toString());
            registrationJSON.put("password",passwordField.getText().toString());
            registrationJSON.put("email",eMailField.getText().toString());
        } catch(JSONException e) {
            e.printStackTrace();
        }


        return registrationJSON;
    }

    private void postRequestRegistration() {
        RequestQueue requestQueue= Volley.newRequestQueue(RegistrationActivity.this);

        Common com = new Common();
        String url= com.urlREGISTRATION;

        StringRequest stringRequest=new StringRequest(Request.Method.POST, url, new Response.Listener<String>() {
            @Override
            public void onResponse(String response) {
                //let's parse json data
                try {
                    JSONObject jsonObject = new JSONObject(response);
                    String message = jsonObject.getString("message");
                    if(message.equals("Error: User already exists!")){
                        errorMessage.setText("This phone number is already registered");
                    }else{
                        String currentPhone = phoneField.getText().toString();
                        String currentPassword = passwordField.getText().toString();

                        SessionData.setUsername(mContext, currentPhone);
                        SessionData.setPassword(mContext, currentPassword);

                        goToHomeActivity();
                    }
                    //goBackToMainView.setText("Data 1 : " + jsonObject.getString("message")+"\n");
                }
                catch (Exception e){
                    e.printStackTrace();
                    errorMessage.setText("POST DATA : unable to Parse Json");
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

                Map<String,String> params=new HashMap<String, String>();
                params.put("name",nameField.getText().toString());
                params.put("surname",surNameField.getText().toString());
                params.put("email",eMailField.getText().toString());
                params.put("phone",phoneField.getText().toString());
                params.put("password",passwordField.getText().toString());
                return params;
            }

            @Override
            public Map<String,String> getHeaders() throws AuthFailureError {
                Map<String,String> params=new HashMap<String, String>();
                params.put("Content-Type","application/x-www-form-urlencoded");
                return params;
            }
        };

        requestQueue.add(stringRequest);

    }

    public void goToHomeActivity(){
        Intent intent = new Intent(this, HomeActivity.class);
        startActivity(intent);
    }


}
