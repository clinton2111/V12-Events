(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardSettingsService', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        updatePassword: function(data) {
          var q;
          data.location = 'update_password';
          q = $q.defer();
          $http({
            url: API.url + 'settingsHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        addEmail: function(data) {
          var q;
          data.location = 'add_email';
          q = $q.defer();
          $http({
            url: API.url + 'settingsHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        fetchEmail: function() {
          var data, q;
          data = {
            location: 'fetch_email'
          };
          q = $q.defer();
          $http({
            url: API.url + 'settingsHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        deleteEmail: function(id) {
          var data, q;
          data = {
            location: 'delete_email',
            id: id
          };
          q = $q.defer();
          $http({
            url: API.url + 'settingsHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        }
      };
    }
  ]);

}).call(this);
