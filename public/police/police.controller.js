(function () {

    angular.module("pick-a-park").controller("policeCtrl", policeCtrl);

    policeCtrl.$inject = ["$http", "$window", "$location", "$scope", "authentication"];
    function policeCtrl($http, $window, $location, $scope, authentication) {

        var vm = this;



        initController();

        function initController() {

        }



    }
})();





