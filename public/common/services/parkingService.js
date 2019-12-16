(function () {
  angular.module("pick-a-park").service("parkingService", parkingService);

  parkingService.$inject = ["$http", "authentication"];
  function parkingService($http, authentication) {

    //Get all parkings of a company
    getParkings = function (name) {
      return $http
        .get("/api/companies/" + name + "/parkings/", {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };



    //Get single parking
    getParking = function (name, id) {
      return $http
        .get("/api/companies/" + name + "/parkings/" + id, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Private functions to handle response
    function handleSuccess(res) {
      console.log("content" + res.data.content);
      return res.data.content;
    }

    function handleError(res) {
      console.log(res.data.message);
    }

    return {
      getParkings: getParkings,
      getParking: getParking
    };
  }
})();
