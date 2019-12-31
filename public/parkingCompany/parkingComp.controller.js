(function () {

    angular.module("pick-a-park").controller("parkingCompCtrl", parkingCompCtrl);

    parkingCompCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication", "parkingService"];
    function parkingCompCtrl($http, $window, $location, $scope, authentication, parkingService) {

        var vm = this;

        vm.user = {}; //Current user data

        vm.unapprovedParkings = []; //List of unapproved parkings
        vm.approvedParkings = []; //List of approved parkings
        vm.parkingDetails = null; //Parking to show details of

        vm.newParking = {
            id: null,
            city: "",
            address: "",
            longitude: null,
            latitude: null,
            price: null,
            indoor: false,
            handicap: false
        };

        initController();

        function initController() {
            authentication.getUser()
                .success(function (data) {
                    vm.user = data;
                })
                .error(function (e) {
                    console.log(e);
                }).then(function () {
                    getUnapprovedParkings();
                })
        }

        //Request new parking
        vm.onSubmitRequest = function () {
            parkingService.newParking(vm.user.company, vm.newParking).then(function (response) {
                if (response === "existingParkingError") {
                    window.alert("L'ID selezionato è già esistente");
                } else if (response === "existingCoordError") {
                    window.alert("Le coordinate selezionate sono già esistenti");
                } else {
                    window.alert("Richiesta inviata con successo");
                    window.location.reload();
                }
            });
        };


        //Delete parking request
        vm.onSubmitDelete = function (id) {
            parkingService.deleteParking(vm.user.company, id).then(function (response) {
                window.alert("Richiesta eliminata con successo");
                window.location.reload();
            });
        };

        //Retrieve and split approved/unapproved parkings
        function getUnapprovedParkings() {
            parkingService
                .getParkings(vm.user.company)
                .then(function (result) {
                    result.forEach(parking => {
                        if (!parking.isApproved) {
                            vm.unapprovedParkings.push(parking);
                        } else {
                            vm.approvedParkings.push(parking);
                        }
                    });
                });
        }


        //Set current parking to show
        vm.showparkingDetails = function (parkingId) {

            for (var i = 0; i < vm.approvedParkings.length; i++) {
                if (vm.approvedParkings[i].id === parkingId) {
                    vm.parkingDetails = vm.approvedParkings[i];
                    console.log(vm.approvedParkings[i]);
                    break;
                }
            }
            //If map has not already been initialized
            if ($scope.map === undefined) {
                initMap();
            }
            setParkingMarker()
        }

        //Google Maps

        var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(43.139528, 13.0677438),
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        //Init the map when loading details
        function initMap() {
            $scope.map = new google.maps.Map(
                document.getElementById("map"),
                mapOptions
            );
            //Init marker
            $scope.mapMarker = null;
        }

        var infoWindow = new google.maps.InfoWindow();

        //Center map to coordinates
        function moveToLocation(lat, lng) {
            var center = new google.maps.LatLng(lat, lng);
            $scope.map.panTo(center);
        }

        //Sets parking marker
        function setParkingMarker() {

            var id = vm.parkingDetails.id.toString();
            var info =
            {
                desc: "Parking " + id,
                lat: vm.parkingDetails.coordinates.latitude,
                long: vm.parkingDetails.coordinates.longitude,
            };

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.desc
            });

            moveToLocation(info.lat, info.long)

            //Open info window
            google.maps.event.addListener(marker, "click", function () {
                infoWindow.setContent(marker.title);
                infoWindow.open($scope.map, marker);
            });

            //Replace marker
            if ($scope.mapMarker != null) {
                $scope.mapMarker.setMap(null);
                $scope.mapMarker = null;
            }
            $scope.mapMarker = marker;
        }

        //Show info window
        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, "click");
        };



    }
})(); 