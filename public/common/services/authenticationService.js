(function () {
  angular.module("pick-a-park").service("authentication", authentication);

  authentication.$inject = ["$http", "$window", "$location"];
  function authentication($http, $window, $location) {
    var saveToken = function (token) {
      $window.localStorage["mean-token"] = token;
    };

    var getToken = function () {
      return $window.localStorage["mean-token"];
    };

    //Return current user token attributes
    var tokenData = function () {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email: payload.email,
          username: payload.username,
          role: payload.role
        };
      }
    };

    //Check if user is logged in
    var isLoggedIn = function () {
      var token = getToken();
      var payload;
      if (token) {
        payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    //Register a new user
    register = function (user) {
      return $http.post("/api/users", user).then(handleSuccess, handleError);
    };

    //Login
    login = function (user) {
      return $http.post("/api/login", user).success(function (data) {
        saveToken(data.token);
      });
    };

    //Get current user data
    var getUser = function () {
      return $http.get("/api/users", {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
    };

    //Return user role from token
    var getUserRole = function () {
      var usr = tokenData();
      if (usr) {
        var loggedUserRole = usr.role;
      } else
        loggedUserRole = "err";
      return loggedUserRole;
    };

    //Private functions to handle response
    function handleSuccess(res) {
      return res.data.content;
    }

    //undefined
    function handleError(res) {
      console.log("returned from service:" + res);
      return res.data.message;

    }

    return {
      saveToken: saveToken,
      getToken: getToken,
      tokenData: tokenData,
      isLoggedIn: isLoggedIn,
      register: register,
      login: login,
      getUser: getUser,
      getUserRole: getUserRole
    };
  }
})();
