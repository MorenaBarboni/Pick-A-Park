(function () {

    angular.module("pick-a-park").controller("parkingCompCtrl", parkingCompCtrl);

    parkingCompCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication", "parkingService", "companyService"];
    function parkingCompCtrl($http, $window, $location, $scope, authentication, parkingService, companyService) {

        var vm = this;

        vm.user = {}; //Current user data
        
        vm.parkingDetailsComp = null;

        vm.unapprovedParkings = []; //List of unapproved parkings
        vm.approvedParkings = []; //List of approved parkings

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
                    getAllParkingsComp();
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

        //See all parking spaces of the company

        function getAllParkingsComp(){
            console.log("controller vado");
            parkingService
                .getParkings(vm.user.company)
                .then(function(result){
                    result.forEach(parking => {
                        vm.allParkingsComp.push(parking)});

            });
        }

        //See details of a parking space of the company
        vm.showparkingDetailsComp = function (parkingId){
            for (var index = 0; index < vm.allParkingsComp.length; index++) {
                if (vm.allParkingsComp[index].id=== parkingId) {
                    vm.parkingDetailsComp = vm.allParkingsComp[index];
                    break;
                }
                
            }
        }



    }
})();





