package com.example.pickapark;

import com.google.android.gms.maps.model.LatLng;

import java.util.ArrayList;

class SingletoonFindAPark {

    private LatLng startCoordinates;
    private LatLng destinationCoordinates;

    private LatLng currentPositionInMapAcrtivity;

    private String startAddress;
    private String destinationAddress;

    private LatLng parkingCoordinates;
    private String parkingAddress;

    private int parkId;
    private String carPlate;
    private String userEmail;
    private String city;
    private String address;
    private double price;
    private double distanceFromThePark;
    private String companyId;

    private boolean coveredPark;
    private boolean handicap;
    private int distanceMax;

    private String cardSelected;

    private ArrayList<String> carPlates;
    private ArrayList<String> paymentCards;



    private SingletoonFindAPark(){

        // Coordinates and adresses origin and destination

        this.startCoordinates = new LatLng(0,0);
        this.destinationCoordinates = new LatLng(0,0);

        this.currentPositionInMapAcrtivity = new LatLng(0,0);

        this.startAddress = "";
        this.destinationAddress = "";


        // GET Destination

        this.coveredPark = false;
        this.handicap = false;
        this.distanceMax = 5000;

        // POST booking

        this.parkId = 0;
        this.carPlate = "";
        this.userEmail = "";
        this.city = "";
        this.address = "";
        this.price = 0;
        this.distanceFromThePark = 0;
        this.companyId = "";

        this.cardSelected = "";

        this.carPlates = new ArrayList<>();
        this.paymentCards = new ArrayList<>();
    }

    private static SingletoonFindAPark singletoonFindAParkINFO = null;

    public static SingletoonFindAPark get(){
        if(singletoonFindAParkINFO == null){
            singletoonFindAParkINFO = new SingletoonFindAPark();
        }
        return singletoonFindAParkINFO;
    }

    public LatLng getStartCoordinates() {
        return startCoordinates;
    }

    public void setStartCoordinates(LatLng startCoordinates) {
        this.startCoordinates = startCoordinates;
    }

    public LatLng getDestinationCoordinates() {
        return destinationCoordinates;
    }

    public void setDestinationCoordinates(LatLng destinationCoordinates) {
        this.destinationCoordinates = destinationCoordinates;
    }

    public int getParkId() {
        return parkId;
    }

    public void setParkId(int parkId) {
        this.parkId = parkId;
    }

    public String getCarPlate() {
        return carPlate;
    }

    public void setCarPlate(String carPlate) {
        this.carPlate = carPlate;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getDistanceFromThePark() {
        return distanceFromThePark;
    }

    public void setDistanceFromThePark(double distanceFromThePark) {
        this.distanceFromThePark = distanceFromThePark;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getStartAddress() {
        return startAddress;
    }

    public void setStartAddress(String startAddress) {
        this.startAddress = startAddress;
    }

    public String getDestinationAddress() {
        return destinationAddress;
    }

    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }

    public LatLng getParkingCoordinates() {
        return parkingCoordinates;
    }

    public void setParkingCoordinates(LatLng parkingCoordinates) {
        this.parkingCoordinates = parkingCoordinates;
    }

    public String getParkingAddress() {
        return parkingAddress;
    }

    public void setParkingAddress(String parkingAddress) {
        this.parkingAddress = parkingAddress;
    }

    public ArrayList<String> getCarPlates() {
        return carPlates;
    }

    public void setCarPlates(ArrayList<String> carPlates) {
        this.carPlates = carPlates;
    }

    public ArrayList<String> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(ArrayList<String> paymentCards) {
        this.paymentCards = paymentCards;
    }


    public void addPaymentCard(String cardCode){
        this.paymentCards.add(cardCode);
    }

    public void addCarPlate(String plate){
        this.paymentCards.add(plate);
    }

    public boolean isCoveredPark() {
        return coveredPark;
    }

    public void setCoveredPark(boolean coveredPark) {
        this.coveredPark = coveredPark;
    }

    public boolean isHandicap() {
        return handicap;
    }

    public void setHandicap(boolean handicap) {
        this.handicap = handicap;
    }

    public int getDistanceMax() {
        return distanceMax;
    }

    public void setDistanceMax(int distanceMax) {
        this.distanceMax = distanceMax;
    }

    public String getCardSelected() {
        return cardSelected;
    }

    public void setCardSelected(String cardSelected) {
        this.cardSelected = cardSelected;
    }

    public LatLng getCurrentPositionInMapAcrtivity() {
        return currentPositionInMapAcrtivity;
    }

    public void setCurrentPositionInMapAcrtivity(LatLng currentPositionInMapAcrtivity) {
        this.currentPositionInMapAcrtivity = currentPositionInMapAcrtivity;
    }
}
