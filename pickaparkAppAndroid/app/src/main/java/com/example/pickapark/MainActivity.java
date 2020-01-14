package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    private Button buttonToLogInActivity;
    private Button buttonToSignInActivity;

    Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;

        String username = SessionData.getUsername(mContext);

        if(!username.equals("")){
            goToHomeActivity();
        }

        setContentView(R.layout.activity_main);

        buttonToLogInActivity = requireViewById(R.id.logInButton);
        buttonToSignInActivity = requireViewById(R.id.signInButton);

        buttonToLogInActivity.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                goToActivityLogIn();
            }
        });


        buttonToSignInActivity.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                goToActivityRegistration();
            }
        });
    }

    public void goToActivityLogIn(){

        Intent intent = new Intent(this, LogInActivity.class);
        startActivity(intent);

    }

    public void goToActivityRegistration(){

        Intent intent = new Intent(this, RegistrationActivity.class);
        startActivity(intent);

    }

    public void goToHomeActivity(){

        Intent intent = new Intent(this, HomeActivity.class);
        startActivity(intent);

    }

}
