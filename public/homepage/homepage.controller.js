(function () {

    angular.module("pick-a-park").controller("homepageCtrl", homepageCtrl);

    homepageCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication", "companyService"];
    function homepageCtrl($http, $window, $location, $scope, authentication, companyService) {

        var vm = this;

        vm.accessData = {
            email: "",
            password: ""
        };

        vm.registerData = {
            name: "",
            surname: "",
            email: "",
            username: "",
            password: "",
            role: "",
            company: ""
        };

        vm.companyNames = []

        initController();

        function initController() {
            //Retrieve companies data
            companyService.getCompanies().then(function (result) {
                var companies = result;
                for (var i = 0; i < companies.length; i++) {
                    vm.companyNames.push(companies[i].name);
                }
            })
        }

        //Login
        vm.onSubmitLogin = function () {
            authentication
                .login(vm.accessData)
                .error(function (err) {
                    alert("Email o password errata");
                })
                .then(function () {
                    authentication
                        .getUser()
                        .success(function (data) {
                            vm.user = data;
                        })
                        .error(function (e) {
                            console.log(e);
                        })
                        .then(function () {
                            $location.path("homepage");
                        });
                });
        };


        //Register user and login to private area
        vm.onSubmitRegister = function () {

            authentication.register(vm.registerData).then(function (response) {
                if (response === "existingEmailError") {
                    window.alert("Email già esistente!");
                }
                else if (response === "existingUsernameError") {
                    window.alert("Username già esistente!");
                }
                else if (vm.registerData.role == "ParkingCompany" && vm.registerData.company == "") {
                    window.alert("Selezionare una compagnia!");
                } else if (vm.registerData.role == "") {
                    window.alert("Il ruolo selezionato non è valido!");
                } else {
                    vm.accessData.email = vm.registerData.email;
                    vm.accessData.password = vm.registerData.password;
                    window.alert("Registrazione avvenuta con successo");
                    authentication
                        .login(vm.accessData)
                        .then(function () {
                            authentication.getUser()
                                .success(function (data) {
                                    vm.user = data;
                                })
                                .error(function (e) {
                                    console.log(e);
                                })
                                .then(function () {
                                    $location.path("profile");
                                });
                        });
                }
            });
        };
    }
})();





