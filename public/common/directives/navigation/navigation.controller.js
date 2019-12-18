(function () {
  angular.module("pick-a-park").controller("navigationCtrl", navigationCtrl);

  navigationCtrl.$inject = ["$location", "authentication"];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.token = authentication.tokenData();
  }
})();
