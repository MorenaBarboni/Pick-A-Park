(function () {
  angular.module("pick-a-park", ["ngRoute"]);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "homepage/homepage.view.html",
        controller: "homepageCtrl",
        controllerAs: "vm"
      })
      .otherwise({ redirectTo: "/" });
    $locationProvider.html5Mode(true);
  }
  angular
    .module("pick-a-park")
    .config(["$routeProvider", "$locationProvider", config])
})();
