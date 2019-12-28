(function () {

  angular
    .module('pick-a-park')
    .directive('navfooter', navfooter);

  function navfooter () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navFooter/navFooter.template.html',
      controller: 'navFooterCtrl as navvm'
    };
  }

})();