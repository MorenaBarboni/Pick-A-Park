package com.example.pickapark;

import android.text.Editable;
import android.widget.EditText;

import java.util.List;

public class UtilitiesPickAPark {

    public void disableASetEditText(List<EditText> listOfEditText){
        for(EditText et : listOfEditText){
            et.setEnabled(false);
        }
    }
    public void enableASetEditText(List<EditText> listOfEditText){
        for(EditText et : listOfEditText){
            et.setEnabled(true);
        }
    }
}
