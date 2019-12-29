package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    private Button buttonToLogInActivity;
    private Button buttonToSignInActivity;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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

}
