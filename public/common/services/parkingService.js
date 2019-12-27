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

    //New parking
    newParking = function (name, parking) {
      return $http
        .post("/api/companies/" + name + "/parkings", parking, {
          headers: {
            Authorization: "Bearer " + authentication.getToken()
          }
        })
        .then(handleSuccess, handleError);
    };

    //Delete parking
    deleteParking = function (name, id) {
      return $http.delete("/api/companies/" + name + "/parkings/" + id, {
        headers: {
          Authorization: "Bearer " + authentication.getToken()
        }
      }).then(handleSuccess, handleError);
    };


    updateParking = function (company, updatedData) {
      return $http
        .patch("/api/parkings/" + company, updatedData).then(handleSuccess, handleError);
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
      getParkings: getParkings,
      getParking: getParking,
      newParking: newParking,
      deleteParking: deleteParking,
      updateParking: updateParking
    };
  }
})();
