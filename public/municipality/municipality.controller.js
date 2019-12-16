(function () {

    angular.module("pick-a-park").controller("municipalityCtrl", municipalityCtrl);

    municipalityCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication", "companyService", "parkingService"];
    function municipalityCtrl($http, $window, $location, $scope, authentication, companyService, parkingService) {

        var vm = this;

        vm.companyNames = []
        vm.allParkings = []

        //Parking to show details of
        vm.parkingDetails = null;


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

        //Retrieve parkings for each company
        function getAllParkings() {
            console.log("controller vado");
            for (i = 0; i < vm.companyNames.length; i++) {
                parkingService
                    .getParkings(vm.companyNames[i])
                    .then(function (result) {
                        result.forEach(parking => {
                            vm.allParkings.push(parking);
                        });
                    });
            }
        }

        vm.showParkingDetails = function (parkingId) {

            for (var i = 0; i < vm.allParkings.length; i++) {

                if (vm.allParkings[i].id === parkingId) {
                    vm.parkingDetails = vm.allParkings[i];
                    break;
                }
            }
        }
    }
})();





