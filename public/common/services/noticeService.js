(function () {
  angular.module("pick-a-park").service("noticeService", noticeService);

  noticeService.$inject = ["$http", "authentication"];
  function noticeService($http, authentication) {

   //New notice
   newNotice = function (notice) {
    return $http
      .post("/api/notices", notice, {
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
      newNotice: newNotice
    };
  }
})();
