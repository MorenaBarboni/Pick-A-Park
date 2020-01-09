(function () {

    angular.module("pick-a-park").controller("municipalityCtrl", municipalityCtrl);

    municipalityCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication", "companyService", "parkingService"];
    function municipalityCtrl($http, $window, $location, $scope, authentication, companyService, parkingService) {

        var vm = this;

        vm.companyNames = []
        vm.approvedParkings = []; //List of approved parkings
        vm.unapprovedParkings = []; //List of unapproved parking requests

        //Parking to show details of
        vm.parkingDetails = null;
        //Table filters
        vm.filter = {
            address: "",
            status: "",
            company: "",
        };


        initController();

        function initController() {
            //Retrieve companies data
            companyService.getCompanies().then(function (result) {
                var companies = result;
                for (var i = 0; i < companies.length; i++) {
                    vm.companyNames.push(companies[i].name);
                }
            }).then(function () {
                getAllParkings()
            })
        }

        //Retrieve approved parkings for each company
        //Init list of unapproved parking requests
        function getAllParkings() {
            for (i = 0; i < vm.companyNames.length; i++) {
                parkingService
                    .getParkings(vm.companyNames[i])
                    .then(function (result) {
                        result.forEach(parking => {
                            if (parking.isApproved) {
                                vm.approvedParkings.push(parking);
                            } else {
                                vm.unapprovedParkings.push(parking);
                            }
                        });
                    });
            }
        }

        vm.showParkingDetails = function (parkingId) {
            var allParkings = vm.approvedParkings.concat(vm.unapprovedParkings);
            for (var i = 0; i < allParkings.length; i++) {
                if (allParkings[i].id === parkingId) {
                    vm.parkingDetails = allParkings[i];
                    break;
                }
            }

            //If map has not already been initialized
            if ($scope.map === undefined) {
                initMap();
            }
            setParkingMarker()
        }

        //Enable/Disable parking
        vm.onSubmitUpdate = function (isUsable) {
            var answer = window.confirm("Sei sicuro di voler modificare il parcheggio?")
            if (answer) {
                var parking = vm.parkingDetails;
                parking.isUsable = isUsable;
                parkingService.updateParking(parking.company, parking.id, parking);
                window.location.reload();
            }
        };

        //Delete parking request
        vm.deleteRequest = function () {
            var answer = window.confirm("Sei sicuro di voler eliminare la richiesta?")
            if (answer) {
                parkingService.deleteParking(vm.parkingDetails.company, vm.parkingDetails.id);
            }
        };

        //Accept parking request
        vm.acceptRequest = function () {
            var answer = window.confirm("Sei sicuro di voler accettare la richiesta?")
            if (answer) {
                vm.parkingDetails.isApproved = true;
                parkingService.updateParking(vm.parkingDetails.company, vm.parkingDetails.id, vm.parkingDetails);
                window.location.reload();
            }
        };

        //Filters table elements to show
        vm.filterTable = function (elements) {
            var result = []
            elements.forEach(parking => {
                //Empty filters
                if (vm.filter.address == "" && vm.filter.company == "" && vm.filter.status == "") {
                    result.push(parking)
                } else {

                    //Apply Filters
                    var parkingAddress = parking.address.toLowerCase();
                    var filterAddress = vm.filter.address.toLowerCase();

                    var parkingCompany = parking.company.toLowerCase();
                    var filterCompany = vm.filter.company.toLowerCase();

                    var boolFilter = false;
                    if (vm.filter.status == "true") {
                        boolFilter = true;
                    }

                    if ((parkingCompany.indexOf(filterCompany) !== -1 || filterCompany == "") && (parkingAddress.indexOf(filterAddress) !== -1 || filterAddress == "") && (parking.isUsable == boolFilter || vm.filter.status == "")) {
                        result.push(parking)
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