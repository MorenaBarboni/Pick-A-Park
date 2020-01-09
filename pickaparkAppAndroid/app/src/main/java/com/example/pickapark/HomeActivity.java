package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

public class HomeActivity extends AppCompatActivity {

    ImageView findAPark;
    ImageView details;
    ImageView payment;
    ImageView notice;
    ImageView settings;
    ImageView logOut;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        findAPark = findViewById(R.id.findAParkHIV);
        details = findViewById(R.id.detailsHIV);
        payment = findViewById(R.id.paymentHIV);
        notice = findViewById(R.id.noticeHIV);
        settings = findViewById(R.id.settingHIV);
        logOut = findViewById(R.id.logoutHIV);

        findAPark.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });

        details.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });

        payment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });

        notice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });

        settings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });

        logOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //CODE
            }
        });


    }
}
