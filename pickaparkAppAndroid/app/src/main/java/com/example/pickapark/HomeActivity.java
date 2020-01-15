package com.example.pickapark;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.view.MotionEvent;
import android.view.View;
import android.widget.ImageView;

public class HomeActivity extends AppCompatActivity {

    ImageView findAPark;
    ImageView details;
    ImageView payment;
    ImageView notice;
    ImageView settings;
    ImageView logOut;
    Context mContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        mContext = this;

        findAPark = findViewById(R.id.findAParkHIV);
        details = findViewById(R.id.detailsHIV);
        payment = findViewById(R.id.paymentHIV);
        notice = findViewById(R.id.noticeHIV);
        settings = findViewById(R.id.settingHIV);
        logOut = findViewById(R.id.logoutHIV);

        findAPark.setAlpha((float) 1);
        details.setAlpha((float) 1);
        payment.setAlpha((float) 1);
        notice.setAlpha((float) 1);
        settings.setAlpha((float) 1);
        logOut.setAlpha((float) 1);

        findAPark.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findAPark.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        findAPark.setAlpha((float) 1);
                    }
                }, 200);
                //CODE
            }
        });

        details.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                details.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        details.setAlpha((float) 1);
                    }
                }, 200);
                //CODE
            }
        });


        payment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                payment.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        payment.setAlpha((float) 1);
                    }
                }, 200);
                //CODE
            }
        });


        notice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                notice.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        notice.setAlpha((float) 1);
                    }
                }, 200);
                //CODE
            }
        });


        settings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                settings.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        settings.setAlpha((float) 1);
                    }
                }, 200);
                //CODE
            }
        });

        logOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logOut.setAlpha((float) 0.55);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    public void run() {
                        logOut.setAlpha((float) 1);
                    }
                }, 200);
                AlertDialog.Builder altdial = new AlertDialog.Builder(HomeActivity.this);
                altdial.setMessage("Do you want to log out ?").setCancelable(false)
                        .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                SessionData.clear(mContext);
                                goToMainActivity();
                            }
                        })
                        .setNegativeButton("No", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.cancel();
                            }
                        });

                AlertDialog alert = altdial.create();
                alert.setTitle("Dialog Header");
                alert.show();
            }
        });



    }

    public void goToMainActivity(){
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
}
