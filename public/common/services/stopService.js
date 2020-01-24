(function () {
  angular.module("pick-a-park").service("stopService", stopService);

  stopService.$inject = ["$http", "authentication"];
  function stopService($http, authentication) {

    //Get all stops of a company
    getStops = function (name) {
      return $http
        .get("/api/companies/" + name + "/stops", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };


    //Private functions to handle response
    function handleSuccess(res) {
      return res.data.content;
    }

    function handleError(res) {
      console.log(res.data.message);
      return res.data.message;
    }

    return {
      getStops: getStops
    };
  }
})();
