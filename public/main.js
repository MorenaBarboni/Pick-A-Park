(function () {
  angular.module("pick-a-park", ["ngRoute"]);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "homepage/homepage.view.html",
        controller: "homepageCtrl",
        controllerAs: "vm"
      }).when("/municipality", {
        templateUrl: "municipality/municipality.view.html",
        controller: "municipalityCtrl",
        controllerAs: "vm"
      }).when("/municipality/requests", {
        templateUrl: "municipality/municipality.request.view.html",
        controller: "municipalityCtrl",
        controllerAs: "vm"
      })
      .when("/municipality/companies", {
        templateUrl: "municipality/municipality.companies.view.html",
        controller: "municipalityCtrl",
        controllerAs: "vm"
      }).when("/municipality/analytics/company/:name/parking/:id", {
        templateUrl: "municipality/municipality.analytics.view.html",
        controller: "municipalityAnalyticsCtrl",
        controllerAs: "vm"
      }).when("/parkingCompany", {
        templateUrl: "parkingCompany/parkingComp.view.html",
        controller: "parkingCompCtrl",
        controllerAs: "vm"
      })
      .when("/parkingCompany/requests", {
        templateUrl: "parkingCompany/pc.request.view.html",
        controller: "parkingCompCtrl",
        controllerAs: "vm"
      }).when("/parkingCompany/stops", {
        templateUrl: "parkingCompany/pc.stops.view.html",
        controller: "parkingCompCtrl",
        controllerAs: "vm"
      })
      .when("/municipalPolice", {
        templateUrl: "police/police.view.html",
        controller: "policeCtrl",
        controllerAs: "vm"
      })
      .when("/logout", {
        resolve: {
          logout: [
            "logoutService",
            function (logoutService) {
              logoutService();
            }
          ]
        },
        redirectTo: "/"
      })
      .otherwise({ redirectTo: "/" });
    $locationProvider.html5Mode(true);
  }


  function run($rootScope, $location, authentication) {
    $rootScope.$on("$routeChangeStart", function (
      event,
      nextRoute,
      currentRoute
    ) {
      if (
        $location.path() === "/profile" && (!authentication.isLoggedIn())
      ) {
        $location.path("/");
      } else if ($location.path() === "/" && authentication.isLoggedIn()) {
        if (authentication.getUserRole() == "Municipality")
          $location.path("/municipality");
        else if (authentication.getUserRole() == "Police")
          $location.path("/municipalPolice");
        else if (authentication.getUserRole() == "ParkingCompany")
          $location.path("/parkingCompany");
      } else if ($location.path().startsWith("/municipality") && (!authentication.isLoggedIn() || authentication.getUserRole() != "Municipality")) {
        $location.path("/");
      } else if ($location.path().startsWith("/parkingCompany") && (!authentication.isLoggedIn() || authentication.getUserRole() != "ParkingCompany")) {
        $location.path("/");
      } else if ($location.path().startsWith("/municipalPolice") && (!authentication.isLoggedIn() || authentication.getUserRole() != "Police")) {
        $location.path("/");
      }
    });
  }

  angular
    .module("pick-a-park")
    .config(["$routeProvider", "$locationProvider", config])
    .run(["$rootScope", "$location", "authentication", run]);
})();