(function () {

    angular.module("pick-a-park").controller("homepageCtrl", homepageCtrl);

    homepageCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication"];
    function homepageCtrl($http, $window, $location, $scope, authentication) {

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

        initController();

        function initController() {
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

            //Define user role according to email
            var splitMail = vm.registerData.email.split('@');
            var checkEmail = splitMail[splitMail.length - 1];

            //If Parking Company, define role and company of user
            if (checkEmail.startsWith("Parking")) {
                vm.registerData.role = "ParkingCompany";
                var splitParkMail = checkEmail.split('.');
                if (splitParkMail.length == 3) {
                    vm.registerData.company = splitParkMail[1];
                }
            } else {
                switch (checkEmail) {
                    case "Municipality.com":
                        vm.registerData.role = "Municipality";
                        break;
                    case "Police.com":
                        vm.registerData.role = "Police";
                        break;
                    default:
                        vm.registerData.role = "Undefined";
                        break;
                }

            }
            authentication.register(vm.registerData).then(function (response) {
                if (response.data === "existingEmailError") {
                    window.alert("Email già esistente!");
                }
                if (response.data === "existingUsernameError") {
                    window.alert("Username già esistente!");
                }
                else if (response.data === "invalidEmailError") {
                    window.alert("L'email inserita non è valida!");
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





