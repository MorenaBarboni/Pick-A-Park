package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class LogInActivity extends AppCompatActivity {

    private TextView goBackToMainView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        goBackToMainView = requireViewById(R.id.notHaveAccount);

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

}
