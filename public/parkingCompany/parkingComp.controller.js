(function () {

    angular.module("pick-a-park").controller("parkingCompCtrl", parkingCompCtrl);

    parkingCompCtrl.$inject = ["$window", "$location", "$scope", "authentication", "parkingService", "stopService"];
    function parkingCompCtrl($window, $location, $scope, authentication, parkingService, stopService) {

        var vm = this;
        vm.user = {}; //Current user data

        vm.unapprovedParkings = []; //List of unapproved parkings
        vm.approvedParkings = []; //List of approved parkings
        vm.parkingDetails = null; //Parking to show details of
        vm.pendingStops = []; //list of both invalid and unpaid stops
        vm.archivedStops = [];//list of valid and paid stops
        vm.stopDetails = null; //stop to show details of

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

        vm.newPrice = null; //New parking price

        //Table filters for parkings
        vm.filter = {
            address: "",
            location: "",
            price: null,
        };
        //Table filters for stops
        vm.stopFilter = {
            start: ""
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
                    getAllStops();
                })
        }


        //Get all stops
        function getAllStops() {
            stopService
                .getStops(vm.user.company)
                .then(function (result) {
                    result.forEach(stop => {
                        //Retrieve pending invalid stops (Not ended)
                        if (stop.valid == false && stop.end == null) {
                            stop.start = new Date(stop.start).toLocaleString();
                            vm.pendingStops.push(stop);
                        }
                        //Retrieve pending valid and invalid stops (ended)
                        else if (stop.end != null) {
                            stop.duration = (Math.abs(new Date(stop.end) - new Date(stop.start)) / 3600000).toFixed(2);
                            stop.start = new Date(stop.start).toLocaleString();
                            stop.end = new Date(stop.end).toLocaleString();
                            if (stop.paid != null) {
                                stop.paid = new Date(stop.paid).toLocaleString();
                            }
                            if (stop.paid == null || stop.email == null) {
                                vm.pendingStops.push(stop)
                            } else {
                                vm.archivedStops.push(stop)
                            }
                        }
                    })
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

        //Set current parking to show
        vm.showparkingDetails = function (parkingId) {

            for (var i = 0; i < vm.approvedParkings.length; i++) {
                if (vm.approvedParkings[i].id === parkingId) {
                    vm.parkingDetails = vm.approvedParkings[i];
                    break;
                }
            }
            //If map has not already been initialized
            if ($scope.map === undefined) {
                initMap();
            }
            setParkingMarker()
        }

        //Set current stop to show
        vm.showStopDetails = function (stopId) {

            for (var i = 0; i < vm.pendingStops.length; i++) {
                if (vm.pendingStops[i]._id === stopId) {
                    vm.stopDetails = vm.pendingStops[i];
                    break;
                }
            }
        }

        //Update price of a parking
        vm.onSubmitUpdate = function (newPrice) {
            var answer = window.confirm("Sei sicuro di voler modificare la tariffa?")
            if (answer) {
                $scope.visibleParkings.forEach(parking => {
                    parking.price = newPrice;
                    parkingService.updateParking(vm.user.company, parking.id, parking);
                });
                window.alert("Modifica completata con successo!");
                window.location.reload();
            }

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

        //Filters parking table elements to show
        vm.filterTable = function () {
            var result = []
            vm.approvedParkings.forEach(parking => {

                //Empty filters
                if (vm.filter.address == "" && vm.filter.price == null && vm.filter.location == "") {
                    result.push(parking)
                } else {

                    //Apply Filters
                    var parkingAddress = parking.address.toLowerCase();
                    var filterAddress = vm.filter.address.toLowerCase();

                    var boolFilter = false;
                    if (vm.filter.location == "true") {
                        boolFilter = true;
                    }

                    if ((parking.price == vm.filter.price || vm.filter.price == null) && (parkingAddress.indexOf(filterAddress) !== -1 || filterAddress == "") && (parking.indoor == boolFilter || vm.filter.location == "")) {
                        result.push(parking)
                    }
                }
            });
            return result;
        };

        //Filters stop table elements to show
        vm.filterStopTable = function () {
            var result = []
            vm.pendingStops.forEach(stop => {
                //Empty filters
                if (vm.stopFilter.start == "") {
                    result.push(stop)
                } else {
                    //Apply Filters
                    var startDate = stop.start.toString();

                    if (startDate.startsWith(vm.stopFilter.start)) {
                        result.push(stop)
                    }
                }
            });
            return result;
        };

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
                long: vm.parkingDetails.location.coordinates[0],
                lat: vm.parkingDetails.location.coordinates[1],
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
