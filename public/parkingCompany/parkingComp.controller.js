(function () {

    angular.module("pick-a-park").controller("parkingCompCtrl", parkingCompCtrl);

    parkingCompCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication"];
    function parkingCompCtrl($http, $window, $location, $scope, authentication) {

        var vm = this;



        initController();

        function initController() {

        }



    }
})();





