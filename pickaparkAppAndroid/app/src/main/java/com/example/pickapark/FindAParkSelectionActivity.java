package com.example.pickapark;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

public class FindAParkSelectionActivity extends AppCompatActivity {

    Button findAParkButton;
    Spinner car;
    Spinner preferenceOfParkingSpace;
    EditText startLocation;
    EditText destinationLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_find_apark_selection);
        findAParkButton = findViewById(R.id.buttonGoToPark);
        car = findViewById(R.id.spinnerCar);
        preferenceOfParkingSpace = findViewById(R.id.spinnerParkPreference);
        startLocation = findViewById(R.id.startLocation);
        destinationLocation = findViewById(R.id.destinationLocation);

        findAParkButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                goToNavigation();
            }
        });
    }

    public void goToNavigation(){
        Intent intent = new Intent(this, MapsActivity.class);
        startActivity(intent);
    }
}
