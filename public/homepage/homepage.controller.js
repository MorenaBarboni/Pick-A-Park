(function () {
   
    angular.module("pick-a-park").controller("homepageCtrl", homepageCtrl);

    homepageCtrl.$inject = ["$http", "$window", "$location", "$scope"];
    function homepageCtrl($http, $window, $location, $scope) {

        var vm = this;

        initController();

        function initController() {
        }

    }
})();
