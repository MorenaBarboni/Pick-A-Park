(function () {
  angular.module("pick-a-park").service("companyService", companyService);

  companyService.$inject = ["$http", "$window", "$location", "authentication"];
  function companyService($http, $window, $location, authentication) {

    //Get all companies
    getCompanies = function () {
      return $http
        .get("/api/companies")
        .then(handleSuccess, handleError);
    };

    getCompanyByName = function () {
      return $http
        .get("/api/companies/:name")
        .then(handleSuccess, handleError);
    };

    newCompany = function ( company) {
      return $http
      .post("/api/companies", company,{
        headers:{
          Authorization: "Bearer" +authentication.getToken()
        }
      })
      .then(handleSuccess,handleError);
    };

    //Private functions to handle response
    function handleSuccess(res) {
      return res.data.content;
    }

    function handleError(res) {
      console.log(res.data.message);
    }

    return {
      getCompanies: getCompanies,
      getCompanyByName: getCompanyByName
    };
  }
})();
