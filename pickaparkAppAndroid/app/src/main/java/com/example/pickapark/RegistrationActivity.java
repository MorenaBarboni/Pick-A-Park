package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class RegistrationActivity extends AppCompatActivity {

    private TextView goBackToMainView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration);

        goBackToMainView = requireViewById(R.id.alredyHaveAccount);

        goBackToMainView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int color = Integer.parseInt("bdbdbd", 16)+0xFF000000;
                goBackToMainView.setTextColor(color);
                setGoBackToMainView();
            }
        });

    }

    public void setGoBackToMainView(){
        Intent intet = new Intent(this, MainActivity.class);
        startActivity(intet);
    }
}
