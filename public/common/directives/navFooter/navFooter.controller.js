(function () {
  angular.module("pick-a-park").controller("navFooterCtrl", navFooterCtrl);

  navFooterCtrl.$inject = ["$location", "authentication"];
  function navFooterCtrl($location, authentication) {
    var vm = this;

    vm.token = authentication.tokenData();
  }
})();
