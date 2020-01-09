package com.example.pickapark;

public class Car {



    String driver;
    String plate;
    String fuel;
    String size;
    String type;


    public Car(String driver, String plate, String fuel, String size, String type) {
        this.driver = driver;
        this.plate = plate;
        this.fuel = fuel;
        this.size = size;
        this.type = type;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getPlate() {
        return plate;
    }

    public void setPlate(String plate) {
        this.plate = plate;
    }

    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }





}
